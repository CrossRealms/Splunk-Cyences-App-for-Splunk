import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    TextField,
    Switch,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    FormControlLabel,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    Alert,
    DialogActions,
} from "@mui/material";
import TimeRangeDialog from './TimeRangeDialog';
import useSplunkSearch from '../../hooks/useSplunkSearch';
import { createOrUpdateMacro, createOrUpdateSavedSearch } from '../../utils/api';
import { useToast } from '../../SnackbarProvider';
import { resolveTimeRange } from '../resolveTimeRange';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const presetTimeMap = {
    "Today": { earliest: "-24h", latest: "now" },

    "Week to date": { earliest: "-7d", latest: "now" },
    "Business week to date": { earliest: "-7d", latest: "now" },
    "Month to date": { earliest: "-1mon", latest: "now" },
    "Year to date": { earliest: "-1y", latest: "now" },

    "Yesterday": { earliest: "-48h", latest: "-24h" },
    "Previous week": { earliest: "-14d", latest: "-7d" },
    "Previous business week": { earliest: "-14d", latest: "-7d" },
    "Previous month": { earliest: "-2mon", latest: "-1mon" },
    "Previous year": { earliest: "-2y", latest: "-1y" },

    "Last 15 minutes": { earliest: "-15m", latest: "now" },
    "Last 60 minutes": { earliest: "-60m", latest: "now" },
    "Last 4 hours": { earliest: "-4h", latest: "now" },
    "Last 24 hours": { earliest: "-24h", latest: "now" },

    "Last 7 days": { earliest: "-7d", latest: "now" },
    "Last 30 days": { earliest: "-30d", latest: "now" },

    "All time": { earliest: "0", latest: "now" }
};


function validateCron(expr) {
    if (!expr || expr.trim() === "") return { valid: false, error: "Cron expression is required" };

    const parts = expr.trim().split(/\s+/);

    if (parts.length < 5 || parts.length > 6) {
        return { valid: false, error: "Cron must have 5 or 6 fields" };
    }

    const validators = [
        {
            name: "Minutes",
            regex: /^(\*|\*\/\d+|([0-5]?\d)(-[0-5]?\d)?(\/\d+)?)(,(\*|\*\/\d+|([0-5]?\d)(-[0-5]?\d)?(\/\d+)?))*$/
        },
        {
            name: "Hours",
            regex: /^(\*|\*\/\d+|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?)(,(\*|\*\/\d+|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?))*$/
        },
        {
            name: "Day of Month",
            regex: /^(\*|\*\/\d+|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?)(,(\*|\*\/\d+|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?))*$/
        },
        {
            name: "Month",
            regex: /^(\*|\*\/\d+|(1[0-2]|0?[1-9]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-(1[0-2]|0?[1-9]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(\/\d+)?)(,(\*|\*\/\d+|(1[0-2]|0?[1-9]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-(1[0-2]|0?[1-9]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(\/\d+)?))*$/
        },
        {
            name: "Day of Week",
            regex: /^(\*|\*\/\d+|([0-7]|SUN|MON|TUE|WED|THU|FRI|SAT)(-([0-7]|SUN|MON|TUE|WED|THU|FRI|SAT))?(\/\d+)?)(,(\*|\*\/\d+|([0-7]|SUN|MON|TUE|WED|THU|FRI|SAT)(-([0-7]|SUN|MON|TUE|WED|THU|FRI|SAT))?(\/\d+)?))*$/
        }
    ];


    for (let i = 0; i < 5; i++) {
        const field = parts[i];
        const check = validators[i];

        if (!check.regex.test(field)) {
            return { valid: false, error: `${check.name} is invalid` };
        }
    }

    return { valid: true };
}

function getEarliestLatest(selectedRange) {
    if (!selectedRange || typeof selectedRange !== "string") {
        return { earliest: null, latest: null, error: "Invalid range" };
    }

    const preset = presetTimeMap[selectedRange];

    if (!preset) {
        return { earliest: null, latest: null, error: "Unknown range" };
    }

    return {
        earliest: preset.earliest,
        latest: preset.latest,
        error: null
    };
}

function validateResultFields(resultEvents = []) {
    if (!Array.isArray(resultEvents) || resultEvents.length === 0) {
        return { ok: false, error: "No events received yet" };
    }

    const validSeverities = ["info", "low", "medium", "high", "critical"];
    const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

    let hasValidEvent = false;

    for (const event of resultEvents) {
        if (!event || typeof event !== "object") continue;

        const severity = String(event.cyences_severity || "").toLowerCase();
        const timeKey = Object.keys(event).find(k => k.toLowerCase().endsWith("time"));

        if (
            validSeverities.includes(severity) &&
            timeKey &&
            timeRegex.test(String(event[timeKey]))
        ) {
            hasValidEvent = true;
            break;
        }
    }

    return hasValidEvent
        ? { ok: true }
        : { ok: false, error: "No valid events found yet" };
}


export default function CustomAlertCreate({ mode = "add",
    initialData, onClose, savedSearchName, refetch }) {
    const { showToast } = useToast();
    const [query, setQuery] = useState(null);
    // const [earliest, setEarliest] = useState(null);
    // const [latest, setLatest] = useState(null);
    const { results, fields, loading } = useSplunkSearch(query);

    // refs to access latest results/loading/fields inside async callbacks
    const resultsRef = useRef(results);
    const loadingRef = useRef(loading);
    const fieldsRef = useRef(fields);
    const verifyCancelRef = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('resultsRef:', resultsRef.current);
        console.debug('useSplunkSearch updated', { resultsLength: Array.isArray(results) ? results.length : 0, loading });
        resultsRef.current = results;
        loadingRef.current = loading;
        fieldsRef.current = fields;
    }, [results, loading, fields]);

    // Basic Fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [search, setSearch] = useState('');

    // Add Notable Event Section
    const [addNotable, setAddNotable] = useState(true);
    const [filterMacroName, setFilterMacroName] = useState('');
    const [filterMacroValue, setFilterMacroValue] = useState('');
    const [contributingEvents, setContributingEvents] = useState('');
    const [systemCompromisedSearch, setSystemCompromisedSearch] = useState('');
    const [systemCompromisedDrill, setSystemCompromisedDrill] = useState('');
    const [attackerSearch, setAttackerSearch] = useState('');
    const [attackerSearchDrill, setAttackerSearchDrill] = useState('');
    const [product, setProduct] = useState('');
    const [teams, setTeams] = useState('');


    // Send Email Section
    const [sendEmail, setSendEmail] = useState(true);
    const [includeSev, setIncludeSev] = useState('');
    const [excludeSev, setExcludeSev] = useState('');
    const [additionalEmails, setAdditionalEmails] = useState('');
    const [emailsToExclude, setEmailsToExclude] = useState('');
    const [cronExpr, setCronExpr] = useState('');
    const [openTimeRange, setOpenTimeRange] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState("");
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [verifyInfo, setVerifyInfo] = useState(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [teamsList, setTeamsList] = useState([]);
    const attackerSearchRef = useRef(null);
    const attackerDrillRef = useRef(null);
    const systemSearchRef = useRef(null);
    const systemDrillRef = useRef(null);

    // Products search
    const {
        results: productResults
    } = useSplunkSearch(`
    | rest /servicesNS/-/cyences_app_for_splunk/saved/searches count=0 splunk_server=local
    | fields "action.cyences_notable_event_action.products"
    | rename "action.cyences_notable_event_action.products" as alert_products
    | dedup alert_products
`);

    // Teams search
    const {
        results: teamResults,
    } = useSplunkSearch(`
    | rest /servicesNS/-/cyences_app_for_splunk/saved/searches count=0 splunk_server=local
    | fields "action.cyences_notable_event_action.teams"
    | rename "action.cyences_notable_event_action.teams" as teams
    | dedup teams
`);

    const hydrateForm = (data) => {

        setTitle(savedSearchName || "");
        setDescription(data.description || "");
        setSearch(data.search || "");
        setCronExpr(data.cron_schedule || "");

        setSelectedTimeRange(
            `${resolveTimeRange(
                data["dispatch.earliest_time"],
                data["dispatch.latest_time"]
            ).earliest} - ${resolveTimeRange(
                data["dispatch.earliest_time"],
                data["dispatch.latest_time"]
            ).latest}`
        );

        const actions = (data.actions || "").split(",");

        setAddNotable(actions.includes("cyences_notable_event_action"));
        setSendEmail(actions.includes("cyences_send_email_action"));

        // Notable
        setFilterMacroName(
            data["action.cyences_notable_event_action.param.filter_macro_name"] || ""
        );
        setFilterMacroValue(
            data["action.cyences_notable_event_action.param.filter_macro_value"] || ""
        );
        setContributingEvents(
            data["action.cyences_notable_event_action.contributing_events"] || ""
        );
        setSystemCompromisedSearch(
            data["action.cyences_notable_event_action.system_compromised_search"] || ""
        );
        setSystemCompromisedDrill(
            data["action.cyences_notable_event_action.system_compromised_drilldown"] || ""
        );
        setAttackerSearch(
            data["action.cyences_notable_event_action.attacker_search"] || ""
        );
        setAttackerSearchDrill(
            data["action.cyences_notable_event_action.attacker_drilldown"] || ""
        );
        setProduct(
            data["action.cyences_notable_event_action.products"] || ""
        );
        setTeams(
            data["action.cyences_notable_event_action.teams"] || ""
        );


        // Email
        setIncludeSev(
            data["action.cyences_send_email_action.param.cyences_severities_to_include"] || ""
        );
        setExcludeSev(
            data["action.cyences_send_email_action.param.cyences_severities_to_exclude"] || ""
        );
        setAdditionalEmails(
            data["action.cyences_send_email_action.param.email_to_include"] || ""
        );
        setEmailsToExclude(
            data["action.cyences_send_email_action.param.email_to_exclude"] || ""
        );

        // Skip verification for edit
        setVerified(true);
    };


    useEffect(() => {
        if (mode === "edit" && initialData) {
            hydrateForm(initialData);
        }
    }, [mode, initialData]);

    useEffect(() => {
        if (productResults?.length > 0) {
            const cleaned = productResults
                .map(r => r.alert_products)
                .filter(Boolean)
                .map(p => p.trim())
                .map(p => ({ label: p, value: p }));

            //  Add static "Others" option
            setProductsList([
                ...cleaned,
                { label: "Others", value: "Others" }
            ]);
        }
    }, [productResults]);


    useEffect(() => {
        if (teamResults?.length > 0) {
            const rawTeams = teamResults
                .map(r => r.teams)
                .filter(Boolean)
                .map(t => t.trim().toLowerCase()); // normalize

            const uniqueTeams = [...new Set(rawTeams)];

            const formatted = uniqueTeams.map(t => ({ label: t, value: t }));

            setTeamsList(formatted);
        }
    }, [teamResults]);



    const resetForm = () => {
        setTitle("");
        setDescription("");
        setSearch("");
        setCronExpr("");
        setSelectedTimeRange("");

        // notable fields
        setAddNotable(true);
        setFilterMacroName("");
        setFilterMacroValue("");
        setContributingEvents("");
        setSystemCompromisedSearch("");
        setSystemCompromisedDrill("");
        setAttackerSearch("");
        setAttackerSearchDrill("");
        setProduct("");
        setTeams("");

        // email fields
        setSendEmail(true);
        setIncludeSev("");
        setExcludeSev("");
        setAdditionalEmails("");
        setEmailsToExclude("");

        // dispatch values
        // setEarliest("");
        // setLatest("");

        // clear errors
        setErrors({});

        setVerified(false);
        setVerifyInfo(null);
    };

    //teams mulit search

    function validatePairedSearch({
        search,
        drill,
        searchKey,
        drillKey,
        label,
        errors,
        focusRef
    }) {
        const hasSearch = search.trim().length > 0;
        const hasDrill = drill.trim().length > 0;

        if (hasSearch && !hasDrill) {
            errors[drillKey] = `${label} Search Drilldown is required when ${label} Search is provided`;
            focusRef?.current?.focus?.();
        }

        if (hasDrill && !hasSearch) {
            errors[searchKey] = `${label} Search is required when ${label} Drilldown is provided`;
            focusRef?.current?.focus?.();
        }

        return hasSearch;
    }

    const isValidFilterMacroName = (value) =>
        /^[a-zA-Z0-9_-]+(\(\d+\))?$/.test(value);


    function validateForm() {
        const errors = {};

        // Mandatory: Title
        if (!title || title.trim() === "") {
            errors.title = "Title is required";
        }

        // Mandatory: Search
        if (!search || search.trim() === "") {
            errors.search = "Search query is required";
        }

        // Mandatory: Time Range
        if (!selectedTimeRange) {
            errors.timeRange = "Time Range is required";
        }

        // Mandatory: Cron Expression
        const cronCheck = validateCron(cronExpr);
        if (!cronExpr || !cronCheck.valid) {
            errors.cronExpr = cronCheck.error || "Cron expression is required";
        }

        // Notable Event mandatory fields
        // Notable Event mandatory fields
        if (addNotable) {
            let hasAnySearch = false;

            // Filter macro pairing
            if (!filterMacroName || filterMacroName.trim() === "") {
                errors.filterMacroName = "Filter Macro Name is required";
            } else if (!isValidFilterMacroName(filterMacroName.trim())) {
                errors.filterMacroName =
                    "Only letters, numbers, '-' and '_' are allowed. Optional numeric arguments are allowed only at the end, e.g. macro_name(1)";
            }


            if (!filterMacroValue || filterMacroValue.trim() === "") {
                errors.filterMacroValue = "Filter Macro Value is required";
            }

            // 🔁 Attacker pair
            hasAnySearch =
                validatePairedSearch({
                    search: attackerSearch,
                    drill: attackerSearchDrill,
                    searchKey: "attackerSearch",
                    drillKey: "attackerSearchDrill",
                    label: "Attacker",
                    errors,
                    focusRef: attackerSearch ? attackerDrillRef : attackerSearchRef
                }) || hasAnySearch;

            // 🔁 System compromised pair
            hasAnySearch =
                validatePairedSearch({
                    search: systemCompromisedSearch,
                    drill: systemCompromisedDrill,
                    searchKey: "systemCompromisedSearch",
                    drillKey: "systemCompromisedDrill",
                    label: "System Compromised",
                    errors,
                    focusRef: systemCompromisedSearch ? systemDrillRef : systemSearchRef
                }) || hasAnySearch;

            // ⚠️ Contributing Events required if ANY search exists
            if (hasAnySearch && !contributingEvents.trim()) {
                errors.contributingEvents =
                    "Contributing Events is required when Attacker or System Compromised search is present";
            }

            // 📦 Product required
            if (!product || !product.trim()) {
                errors.product = "Product is required when Add Notable Event is enabled";
            }

            // 👥 At least one team required
            if (!teams || !teams.trim()) {
                errors.teams = "At least one team must be selected when Add Notable Event is enabled";
            }
        }



        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    // current error state is in `errors`
    // Verification helper: runs the search and checks for required fields
    const verifySearch = async (timeoutMs = 40000) => {
        verifyCancelRef.current = false;
        setErrors({});
        setVerified(false);

        if (!search || !selectedTimeRange) {
            setErrors({ search: 'Provide both Search and Time Range before verifying.' });
            return false;
        }

        setIsVerifying(true);

        try {
            const { earliest: vEarliest, latest: vLatest } =
                getEarliestLatest(selectedTimeRange);

            const finalQuery = `${search} earliest=${vEarliest} latest=${vLatest}`;
            setQuery(finalQuery);

            const waitForValid = () =>
                new Promise((resolve) => {
                    const start = Date.now();
                    const noResultGraceMs = 10000;

                    const check = () => {
                        if (verifyCancelRef.current) {
                            return resolve({
                                ok: false,
                                results: [],
                                error: "Verification cancelled"
                            });
                        }

                        const latestResults = resultsRef.current || [];

                        // 🔴 HARD FAIL: no results after grace period
                        if (
                            latestResults.length === 0 &&
                            Date.now() - start > noResultGraceMs
                        ) {
                            return resolve({
                                ok: true,
                                results: [],
                            });
                        }

                        const validation = validateResultFields(latestResults);

                        if (validation.ok) {
                            return resolve({ ok: true, results: latestResults });
                        }

                        // ⏱ timeout
                        if (Date.now() - start >= timeoutMs) {
                            return resolve({
                                ok: false,
                                results: latestResults,
                                error: validation.error || "Verification timed out"
                            });
                        }

                        setTimeout(check, 1000);
                    };

                    check();
                });

            const res = await waitForValid();

            if (res.ok) {
                setVerified(true);
                setVerifyInfo({ count: res.results.length });
                return true;
            }

            setErrors({ search: `Verification failed: ${res.error}` });
            return false;

        } finally {
            setIsVerifying(false);
        }
    };


    // --- inside component ---
    // core save logic (assumes validation already passed)
    const doSave = async () => {
        if (isSaving) return; // ⛑ prevent double clicks

        setIsSaving(true);

        try {
            const { earliest: e, latest: l } = getEarliestLatest(selectedTimeRange);
            // setEarliest(e);
            // setLatest(l);

            const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

            const payload = {
                // name: title,
                description,
                search,
                is_scheduled: true,
                cron_schedule: cronExpr,
                'dispatch.earliest_time': e,
                'dispatch.latest_time': l,
                actions: [
                    addNotable ? 'cyences_notable_event_action' : null,
                    sendEmail ? 'cyences_send_email_action' : null,
                ].filter(Boolean).join(','),
                ...(addNotable ? {
                    'action.cyences_notable_event_action.param.filter_macro_name': filterMacroName,
                    'action.cyences_notable_event_action.param.filter_macro_value': filterMacroValue,
                    'action.cyences_notable_event_action.contributing_events': contributingEvents,
                    'action.cyences_notable_event_action.system_compromised_search': systemCompromisedSearch,
                    'action.cyences_notable_event_action.system_compromised_drilldown': systemCompromisedDrill,
                    'action.cyences_notable_event_action.attacker_search': attackerSearch,
                    'action.cyences_notable_event_action.attacker_drilldown': attackerSearchDrill,
                    'action.cyences_notable_event_action.products': product,
                    'action.cyences_notable_event_action.teams': teams,
                } : {}),
                ...(sendEmail ? {
                    'action.cyences_send_email_action.param.cyences_severities_to_include': toArray(includeSev).join(','),
                    'action.cyences_send_email_action.param.cyences_severities_to_exclude': toArray(excludeSev).join(','),
                    'action.cyences_send_email_action.param.email_to_include': toArray(additionalEmails).join(','),
                    'action.cyences_send_email_action.param.email_to_exclude': toArray(emailsToExclude).join(','),
                } : {}),
                'alert.severity': 6
            };

            if (mode === "edit") {
                await createOrUpdateSavedSearch(savedSearchName, payload);
                showToast(`Alert "${title}" updated successfully`, "success");
            } else {
                const payload1 = { name: title, ...payload };
                await createOrUpdateSavedSearch(undefined, payload1);
                showToast(`Alert "${title}" created successfully`, "success");
            }
            if (addNotable && filterMacroName && filterMacroValue) {
                await createOrUpdateMacro(
                    filterMacroName,
                    filterMacroValue
                );
            }

            resetForm();
            refetch && refetch();
            setShowSaveDialog(false);
            onClose(); // ✅ only on success

        } catch (err) {
            console.error("SAVE ERROR RAW →", err);

            const splunkMsg =
                err?.response?.data?.messages?.[0]?.text ||
                err?.response?.data?.[0]?.text ||
                err?.messages?.[0]?.text;

            const message = splunkMsg || "Something went wrong while saving the alert.";

            setErrors({ api: message });
            showToast(message, "error");
        } finally {
            setIsSaving(false); // ✅ ALWAYS reset here
        }
    };


    const handleSave = async () => {
        setErrors({});
        if (!validateForm()) return;

        // If already verified, save immediately
        if (verified) {
            await doSave();
            return;
        }

        // otherwise show confirm dialog
        setShowSaveDialog(true);
    };
    console.log('error', errors);


    return (
        <div style={{ padding: 20, maxWidth: 800 }}>
            <form>
                <Stack spacing={3}>

                    {/* ========================= BASIC SETTINGS ==========================*/}

                    {/* Title */}
                    <TextField
                        label="Title"
                        required
                        disabled={mode === "edit"}
                        value={title}
                        error={!!errors?.title}
                        helperText={errors?.title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Description */}
                    <TextField
                        label="Description"
                        multiline
                        minRows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />

                    {/* Search */}
                    <TextField
                        label="Search"
                        required
                        multiline
                        minRows={4}
                        value={search}
                        error={!!errors?.search}
                        onChange={(e) => {
                            verifyCancelRef.current = true;
                            setVerified(false);
                            setErrors({ ...errors, search: null });
                            setSearch(e.target.value);
                            resultsRef.current = [];
                        }}
                        helperText={
                            errors?.search ||
                            `Required fields: cyences_severity, event_time/_time.
Severity: info | low | medium | high | critical.
Time format: YYYY-MM-DD HH:MM:SS TZ`
                        }
                    />


                    {/* ========================
        TIME RANGE + VERIFY
    =========================*/}
                    <FormControl fullWidth error={!!errors?.timeRange}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenTimeRange(true)}
                            sx={{ justifyContent: "flex-start", height: 56 }}
                        >
                            {selectedTimeRange || "Select Time Range"}
                        </Button>
                        {errors?.timeRange && (
                            <FormHelperText>{errors.timeRange}</FormHelperText>
                        )}
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={verifySearch}
                        disabled={isVerifying || verified || !search || !selectedTimeRange}
                    >
                        {isVerifying
                            ? "Verifying search..."
                            : verified
                                ? "Verified"
                                : "Verify Search Query"}
                    </Button>

                    {verifyInfo && (
                        <Typography
                            variant="caption"
                            color={verified ? "success.main" : "warning.main"}
                        >
                            {verified
                                ? `Verification passed (${verifyInfo.count} events)`
                                : `Verification: ${verifyInfo.count} events found`}
                        </Typography>
                    )}

                    {/* Cron */}
                    <TextField
                        label="Cron Expression"
                        placeholder="*/15 * * * *"
                        value={cronExpr}
                        error={!!errors?.cronExpr}
                        helperText={errors?.cronExpr}
                        onChange={(e) => setCronExpr(e.target.value)}
                    />


                    {/* =========================
        ADD NOTABLE EVENT
    ==========================*/}
                    <Typography variant="h7">Add Notable Event</Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={addNotable}
                                onChange={() => setAddNotable(!addNotable)}
                            />
                        }
                        label="Add Notable Event"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.85rem', // 14px
                            },
                        }}
                    />

                    {addNotable && (
                        <Stack spacing={2}>
                            <TextField
                                label="Filter Macro Name"
                                required
                                value={filterMacroName}
                                error={!!errors?.filterMacroName}
                                helperText={errors?.filterMacroName}
                                onChange={(e) => setFilterMacroName(e.target.value)}
                            />

                            <TextField
                                label="Filter Macro Value"
                                required
                                value={filterMacroValue}
                                error={!!errors?.filterMacroValue}
                                helperText={errors?.filterMacroValue}
                                onChange={(e) => setFilterMacroValue(e.target.value)}
                            />

                            <TextField
                                label="Contributing Events"
                                value={contributingEvents}
                                error={!!errors?.contributingEvents}
                                helperText={errors?.contributingEvents}
                                onChange={(e) => setContributingEvents(e.target.value)}
                            />

                            <TextField
                                label="System Compromised Search"
                                multiline
                                minRows={3}
                                value={systemCompromisedSearch}
                                error={!!errors?.systemCompromisedSearch}
                                helperText={errors?.systemCompromisedSearch}
                                onChange={(e) => setSystemCompromisedSearch(e.target.value)}
                            />

                            <TextField
                                label="System Compromised Search Drilldown"
                                multiline
                                minRows={3}
                                value={systemCompromisedDrill}
                                inputRef={systemDrillRef}
                                // disabled={!systemCompromisedSearch.trim()}
                                error={!!errors?.systemCompromisedDrill}
                                helperText={errors?.systemCompromisedDrill}
                                onChange={(e) => {
                                    setSystemCompromisedDrill(e.target.value);
                                    setErrors(prev => ({ ...prev, systemCompromisedDrill: null }));
                                }}
                            />


                            <TextField
                                label="Attacker Search"
                                multiline
                                minRows={3}
                                value={attackerSearch}
                                error={!!errors?.attackerSearch}
                                helperText={errors?.attackerSearch}
                                onChange={(e) => setAttackerSearch(e.target.value)}
                            />

                            <TextField
                                label="Attacker Search Drilldown"
                                multiline
                                minRows={3}
                                value={attackerSearchDrill}
                                inputRef={attackerDrillRef}
                                // disabled={!attackerSearch.trim()}
                                error={!!errors?.attackerSearchDrill}
                                helperText={errors?.attackerSearchDrill}
                                onChange={(e) => {
                                    setAttackerSearchDrill(e.target.value);
                                    setErrors(prev => ({ ...prev, attackerSearchDrill: null }));
                                }}
                            />


                            {/* Products */}
                            <label>Product</label>
                            <FormControl fullWidth error={!!errors?.product}>
                                <Select
                                    value={product}
                                    onChange={(e) => {
                                        setProduct(e.target.value);
                                        setErrors(prev => ({ ...prev, product: null }));
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem disabled value="">
                                        Select Product
                                    </MenuItem>
                                    {productsList.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors?.product && (
                                    <FormHelperText>{errors.product}</FormHelperText>
                                )}
                            </FormControl>

                            {/* Teams */}
                            <label>Teams</label>
                            <FormControl fullWidth error={!!errors?.teams}>
                                <Select
                                    value={teams}
                                    onChange={(e) => {
                                        setTeams(e.target.value);
                                        setErrors(prev => ({ ...prev, teams: null }));
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem disabled value="">
                                        Select Team
                                    </MenuItem>
                                    {teamsList.map((team) => (
                                        <MenuItem key={team.value} value={team.value}>
                                            {team.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors?.teams && (
                                    <FormHelperText>{errors.teams}</FormHelperText>
                                )}
                            </FormControl>

                        </Stack>
                    )}

                    {/* =========================
                      SEND EMAIL
                    ==========================*/}
                    <Typography variant="h7">Send Email</Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={sendEmail}
                                onChange={() => setSendEmail(!sendEmail)}
                            />
                        }
                        label="Send Email"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.85rem', // 14px
                            },
                        }}
                    />

                    {sendEmail && (
                        <Stack spacing={2}>
                            <TextField
                                label="Severities to include"
                                value={includeSev}
                                onChange={(e) => setIncludeSev(e.target.value)}
                            />

                            <TextField
                                label="Severities to exclude"
                                value={excludeSev}
                                onChange={(e) => setExcludeSev(e.target.value)}
                            />

                            <TextField
                                label="Additional emails"
                                multiline
                                minRows={2}
                                value={additionalEmails}
                                onChange={(e) => setAdditionalEmails(e.target.value)}
                            />

                            <TextField
                                label="Emails to exclude"
                                multiline
                                minRows={2}
                                value={emailsToExclude}
                                onChange={(e) => setEmailsToExclude(e.target.value)}
                            />
                        </Stack>
                    )}

                    {/* =========================
                    ACTION BUTTONS
                    ==========================*/}
                    {errors.api && (
                        <Typography color="error" variant="caption">
                            {errors.api}
                        </Typography>
                    )}

                    <Button variant="contained" onClick={handleSave} disabled={isSaving}>
                        {isSaving
                            ? "Saving..."
                            : mode === "edit"
                                ? "Update Alert"
                                : "Create Alert"}
                    </Button>


                </Stack>
            </form>

            <TimeRangeDialog
                open={openTimeRange}
                onClose={() => setOpenTimeRange(false)}
                onSelect={(value) => setSelectedTimeRange(value)}
            />
            {showSaveDialog && (
                <Dialog
                    open={showSaveDialog}
                    onClose={() => {
                        setShowSaveDialog(false);
                        setErrors({});
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    {/* Header */}
                    <DialogTitle className="flex items-center gap-2">
                        <WarningAmberIcon className="text-amber-500" />
                        <Typography fontWeight={600}>
                            Verify before saving
                        </Typography>
                    </DialogTitle>

                    <Divider />

                    {/* Content */}
                    <DialogContent className="space-y-3 pt-4">
                        <Typography variant="body2" color="text.secondary" className='pb-1'>
                            To ensure this alert works correctly, please verify the
                            search query before saving.
                        </Typography>

                        <Alert severity="info" variant="outlined">
                            The search must include required fields:
                            <strong> cyences_severity</strong> and
                            <strong> _time</strong>
                        </Alert>

                        {errors?.api && (
                            <Alert severity="error">{errors.api}</Alert>
                        )}

                        {errors?.search && (
                            <Alert severity="error">{errors.search}</Alert>
                        )}
                    </DialogContent>

                    {/* Actions */}
                    <DialogActions className="px-6 pb-4">
                        <Button
                            onClick={() => {
                                setShowSaveDialog(false);
                                setErrors({});
                            }}
                            disabled={isSaving || isVerifying}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                setIsVerifying(true);
                                const ok = await verifySearch();
                                setIsVerifying(false);
                                if (ok) {
                                    await doSave();
                                }
                            }}
                            disabled={isVerifying || isSaving}
                        >
                            {isVerifying ? "Verifying…" : "Verify & Save"}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div >
    );
}
