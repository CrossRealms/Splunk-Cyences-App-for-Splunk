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
    Card,
    CardContent,
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
    // If no events → considered verified
    if (!Array.isArray(resultEvents) || resultEvents.length === 0) {
        return { ok: true };
    }

    const validSeverities = ["info", "low", "medium", "high", "critical"];
    const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

    for (const event of resultEvents) {
        if (!event || typeof event !== "object") continue;

        const severity = String(event.cyences_severity || "").toLowerCase();
        const timeKey = Object.keys(event).find(k => k.toLowerCase().endsWith("time"));

        if (
            validSeverities.includes(severity) &&
            timeKey &&
            timeRegex.test(String(event[timeKey]))
        ) {
            return { ok: true };
        }
    }

    return { ok: false, error: "Missing/Invalid severity or time format." };
}


export default function CustomAlertCreate({ mode = "add",
    initialData, onClose, savedSearchName, refetch }) {
    const { showToast } = useToast();
    const [query, setQuery] = useState(null);
    // const [earliest, setEarliest] = useState(null);
    // const [latest, setLatest] = useState(null);
    const { results, fields, loading } = useSplunkSearch(query);
    console.log('new resule', results)

    // refs to access latest results/loading/fields inside async callbacks
    const resultsRef = useRef(results);
    console.log('new resultsRef', resultsRef)

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

        const actions = (data.actions || "")
          .split(",")
          .map(a => a.trim().toLowerCase());

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
            (data["action.cyences_notable_event_action.teams"] || "")
            .trim()
            .toLowerCase()
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
   const verifySearch = async () => {
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

        const finalQuery = `${search} earliest=${vEarliest} latest=${vLatest} | head 5`;

        // reset previous search state
        resultsRef.current = [];
        loadingRef.current = true;

        setQuery(finalQuery);

       const waitForValid = () =>
        new Promise((resolve) => {
          let searchCompleted = false;

          const check = () => {
            if (verifyCancelRef.current) {
              return resolve({
                ok: false,
                results: [],
                error: "Verification cancelled",
              });
            }

            const latestResults = resultsRef.current || [];
            const isLoading = loadingRef.current;

            console.log("loading:", isLoading);
            console.log("results:", latestResults);

            // wait while search running
            if (isLoading) {
              return setTimeout(check, 800);
            }

            // mark search finished once
            if (!isLoading && !searchCompleted) {
              searchCompleted = true;
              return setTimeout(check, 10000);
            }

            // CASE 1: no events
            if (latestResults.length === 0) {
              return resolve({
                ok: true,
                results: [],
                message: "No events found — verified",
              });
            }

            // CASE 2: validate severity
            const validation = validateResultFields(latestResults);

            if (validation.ok) {
              return resolve({
                ok: true,
                results: latestResults,
              });
            }

            return resolve({
              ok: false,
              results: latestResults,
              error: validation.error || "Invalid severity",
            });
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
                    filterMacroValue,
                    null,
                    mode
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

    const ui = {
  page: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  container: {
    flex: "1 1 auto",
    minHeight: 0,
  },
  formWrap: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
  },
  sectionCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  },
  sectionHeader: {
    px: 2,
    py: 1.5,
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
  },
  sectionSub: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748b",
  },
  sectionBody: {
    p: 2,
  },
  stickyActions: {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 12,
  },
  badge: (kind) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #e5e7eb",
    background:
      kind === "success"
        ? "#ecfdf5"
        : kind === "warning"
        ? "#fffbeb"
        : "#f8fafc",
    color:
      kind === "success"
        ? "#047857"
        : kind === "warning"
        ? "#b45309"
        : "#334155",
  }),
};

   return (
  <div style={ui.page}>
    <div style={ui.container}>
      <div style={ui.formWrap}>
        <form>
          <Stack spacing={2.25}>

            {/* API error */}
            {errors.api ? (
              <Alert severity="error" variant="outlined">
                {errors.api}
              </Alert>
            ) : null}
            
            {/* ===== BASIC SETTINGS ===== */}
            <Card variant="outlined" sx={ui.sectionCard}>
              <div style={ui.sectionHeader}>
                <div className='ml-4'>
                  <div style={ui.sectionTitle}>Basic settings</div>
                  <div style={ui.sectionSub}>
                    Name, description, SPL query and schedule basics.
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {verified ? (
                    <span style={ui.badge("success")}>Verified</span>
                  ) : (
                    <span style={ui.badge("warning")}>Not verified</span>
                  )}
                </div>
              </div>

              <CardContent sx={ui.sectionBody}>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    size="small"
                    required
                    disabled={mode === "edit"}
                    value={title}
                    error={!!errors?.title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{ maxLength: 100 }}
                    helperText={errors?.title || `${100 - title.length} characters remaining`}
                    fullWidth
                  />

                  <TextField
                    label="Description"
                    multiline
                    size="small"
                    minRows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Search"
                    required
                    size="small"
                    multiline
                    minRows={5}
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
                      `Required fields: cyences_severity (info | low | medium | high | critical), event_time/_time (%F %T %Z)`
                    }
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* ===== TIME RANGE + VERIFY ===== */}
            <Card variant="outlined" sx={ui.sectionCard}>
              <div style={ui.sectionHeader}>
                <div className='ml-4'>
                  <div style={ui.sectionTitle}>Time range & verification</div>
                  <div style={ui.sectionSub}>
                    Pick time range, verify SPL output shape, then schedule with cron.
                  </div>
                </div>

                {verifyInfo ? (
                  <span style={ui.badge(verified ? "success" : "warning")}>
                    {verified
                      ? `OK • ${verifyInfo.count} events`
                      : `${verifyInfo.count} events`}
                  </span>
                ) : null}
              </div>

              <CardContent sx={ui.sectionBody}>
                <Stack spacing={2}>
                  <FormControl fullWidth error={!!errors?.timeRange}>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenTimeRange(true)}
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: "12px",
                        height: 44,
                        borderColor: "#e5e7eb",
                        color: "#0f172a",
                        background: "#fff",
                        textTransform: "none",
                      }}
                    >
                      {selectedTimeRange || "Select Time Range"}
                    </Button>
                    {errors?.timeRange && (
                      <FormHelperText>{errors.timeRange}</FormHelperText>
                    )}
                  </FormControl>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      onClick={verifySearch}
                      size="small"
                      disabled={isVerifying || verified || !search || !selectedTimeRange}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {isVerifying
                        ? "Verifying search..."
                        : verified
                          ? "Verified"
                          : "Verify Search Query"}
                    </Button>

                    <TextField
                      label="Cron Expression"
                      size="small"
                      placeholder="*/15 * * * *"
                      value={cronExpr}
                      error={!!errors?.cronExpr}
                      helperText={errors?.cronExpr}
                      onChange={(e) => setCronExpr(e.target.value)}
                      sx={{ minWidth: 260 }}
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* ===== NOTABLE EVENT CONFIG ===== */}
            <Card variant="outlined" sx={ui.sectionCard}>
              <div style={ui.sectionHeader}>
                <div className='ml-4'>
                  <div style={ui.sectionTitle}>Notable event configuration</div>
                  <div style={ui.sectionSub}>
                    Used by cyences_notable_event_action to enrich alert context.
                  </div>
                </div>

                {addNotable ? (
                  <span style={ui.badge("success")}>Enabled</span>
                ) : (
                  <span style={ui.badge("warning")}>Disabled</span>
                )}
              </div>

              <CardContent sx={ui.sectionBody}>
                <Stack spacing={2}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <TextField
                      label="Filter Macro Name"
                      required
                      size="small"
                      value={filterMacroName}
                      error={!!errors?.filterMacroName}
                      helperText={errors?.filterMacroName}
                      onChange={(e) => setFilterMacroName(e.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Filter Macro Value"
                      required
                      size="small"
                      value={filterMacroValue}
                      error={!!errors?.filterMacroValue}
                      helperText={errors?.filterMacroValue}
                      onChange={(e) => setFilterMacroValue(e.target.value)}
                      fullWidth
                    />
                  </div>

                  <TextField
                    label="Contributing Events"
                    size="small"
                    value={contributingEvents}
                    error={!!errors?.contributingEvents}
                    helperText={errors?.contributingEvents}
                    onChange={(e) => setContributingEvents(e.target.value)}
                    fullWidth
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <TextField
                      label="System Compromised Search"
                      multiline
                      size="small"
                      minRows={3}
                      value={systemCompromisedSearch}
                      error={!!errors?.systemCompromisedSearch}
                      helperText={errors?.systemCompromisedSearch}
                      onChange={(e) => setSystemCompromisedSearch(e.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="System Compromised Drilldown"
                      multiline
                      size="small"
                      minRows={3}
                      value={systemCompromisedDrill}
                      inputRef={systemDrillRef}
                      error={!!errors?.systemCompromisedDrill}
                      helperText={errors?.systemCompromisedDrill}
                      onChange={(e) => {
                        setSystemCompromisedDrill(e.target.value);
                        setErrors((prev) => ({ ...prev, systemCompromisedDrill: null }));
                      }}
                      fullWidth
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <TextField
                      label="Attacker Search"
                      multiline
                      size="small"
                      minRows={3}
                      value={attackerSearch}
                      error={!!errors?.attackerSearch}
                      helperText={errors?.attackerSearch}
                      onChange={(e) => setAttackerSearch(e.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Attacker Drilldown"
                      multiline
                      size="small"
                      minRows={3}
                      value={attackerSearchDrill}
                      inputRef={attackerDrillRef}
                      error={!!errors?.attackerSearchDrill}
                      helperText={errors?.attackerSearchDrill}
                      onChange={(e) => {
                        setAttackerSearchDrill(e.target.value);
                        setErrors((prev) => ({ ...prev, attackerSearchDrill: null }));
                      }}
                      fullWidth
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormControl fullWidth error={!!errors?.product}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Product
                      </Typography>
                      <Select
                        size="small"
                        value={product}
                        onChange={(e) => {
                          setProduct(e.target.value);
                          setErrors((prev) => ({ ...prev, product: null }));
                        }}
                        displayEmpty
                        sx={{ borderRadius: "12px" }}
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
                      {errors?.product && <FormHelperText>{errors.product}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors?.teams}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Teams
                      </Typography>
                      <Select
                        size="small"
                        value={teams}
                        onChange={(e) => {
                          setTeams(e.target.value);
                          setErrors((prev) => ({ ...prev, teams: null }));
                        }}
                        displayEmpty
                        sx={{ borderRadius: "12px" }}
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
                      {errors?.teams && <FormHelperText>{errors.teams}</FormHelperText>}
                    </FormControl>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* ===== EMAIL SETTINGS ===== */}
            <Card variant="outlined" sx={ui.sectionCard}>
              <div style={ui.sectionHeader}>
                <div className='ml-4'>
                  <div style={ui.sectionTitle}>Email notification settings</div>
                  <div style={ui.sectionSub}>
                    Controls cyences_send_email_action recipients and severities.
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Switch
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                    />
                  }
                  label={
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>
                      {sendEmail ? "Enabled" : "Disabled"}
                    </span>
                  }
                  sx={{ m: 0 }}
                />
              </div>

              <CardContent sx={ui.sectionBody}>
                {sendEmail ? (
                  <Stack spacing={2}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <TextField
                        size="small"
                        label="Severities to include"
                        value={includeSev}
                        onChange={(e) => setIncludeSev(e.target.value)}
                        fullWidth
                      />

                      <TextField
                        size="small"
                        label="Severities to exclude"
                        value={excludeSev}
                        onChange={(e) => setExcludeSev(e.target.value)}
                        fullWidth
                      />
                    </div>

                    <TextField
                      size="small"
                      label="Additional emails"
                      multiline
                      minRows={2}
                      value={additionalEmails}
                      onChange={(e) => setAdditionalEmails(e.target.value)}
                      fullWidth
                    />

                    <TextField
                      size="small"
                      label="Emails to exclude"
                      multiline
                      minRows={2}
                      value={emailsToExclude}
                      onChange={(e) => setEmailsToExclude(e.target.value)}
                      fullWidth
                    />
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Email notifications are disabled for this alert.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Sticky bottom actions */}
            <div style={ui.stickyActions}>
              {/* <div style={{ fontSize: 12, color: "#64748b" }}>
                {mode === "edit" ? `Editing: ${savedSearchName || "—"}` : " "}
              </div> */}

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800 }}
              >
                {isSaving ? "Saving..." : mode === "edit" ? "Update Alert" : "Create Alert"}
              </Button>

              <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "12px" }}>
                Cancel
              </Button>
            </div>
          </Stack>
        </form>

        {/* dialogs unchanged */}
        <TimeRangeDialog
          open={openTimeRange}
          onClose={() => setOpenTimeRange(false)}
          onSelect={(value) => {
            verifyCancelRef.current = true;
            setVerified(false);       
            setVerifyInfo(null); 
            setSelectedTimeRange(value)}}
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
            PaperProps={{
              sx: {
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
              },
            }}
          >
            <DialogTitle className="flex items-center gap-2">
              <WarningAmberIcon className="text-amber-500" />
              <Typography fontWeight={800}>Verify before saving</Typography>
            </DialogTitle>

            <Divider />

            <DialogContent className="space-y-3 pt-4">
              <Typography variant="body2" color="text.secondary" className="pb-1">
                To ensure this alert works correctly, please verify the search query before saving.
              </Typography>

              <Alert severity="info" variant="outlined">
                The search must include required fields:
                <strong> cyences_severity</strong> and <strong> _time</strong>
              </Alert>

              {errors?.api && <Alert severity="error">{errors.api}</Alert>}
              {errors?.search && <Alert severity="error">{errors.search}</Alert>}
            </DialogContent>

            <DialogActions className="px-6 pb-4">
              <Button
                onClick={() => {
                  setShowSaveDialog(false);
                  setErrors({});
                }}
                disabled={isSaving || isVerifying}
                sx={{ borderRadius: "12px", textTransform: "none" }}
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
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800 }}
              >
                {isVerifying ? "Verifying…" : "Verify & Save"}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  </div>
);
}
