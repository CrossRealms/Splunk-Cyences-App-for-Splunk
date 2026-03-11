import React, { useEffect, useMemo, useState } from "react";
import { axiosCallWrapper } from "./utils/axiosCallWrapper";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { toast } from "react-toastify";

const EmailConfigurationFields = {
  emailSubjectLabel: "Environment Name",
  emaiSubjectHelp:
    "This will be used in the alert emails sent by Cyences and other places.",
};

const macroName = "cs_email_subject_prefix";
const outsideWorkingHourMacro = "cs_outside_working_hour_definition";

function extractSplunkError(err) {
  const text = err?.response?.data?.messages?.[0]?.text;
  return text || err?.message || String(err);
}

export default function CyencesGeneralConfiguration() {
  const [prefixValue, setPrefixValue] = useState("");
  const [outsideWorkingHourValue, setOutsideWorkingHourValue] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = useMemo(() => {
    return prefixValue.trim().length > 0 && outsideWorkingHourValue.trim().length > 0;
  }, [prefixValue, outsideWorkingHourValue]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const [emailResp, outsideResp] = await Promise.all([
          axiosCallWrapper({
            endpointUrl: `configs/conf-alert_actions/cyences_send_email_action`,
          }),
          axiosCallWrapper({
            endpointUrl: `configs/conf-macros/${outsideWorkingHourMacro}`,
          }),
        ]);

        if (cancelled) return;

        const emailContent = emailResp.data.entry?.[0]?.content ?? {};
        const subject_prefix = emailContent["param.subject_prefix"] ?? "";
        setPrefixValue(subject_prefix);

        const outsideContent = outsideResp.data.entry?.[0]?.content ?? {};
        setOutsideWorkingHourValue(outsideContent.definition ?? "");
      } catch (err) {
        if (cancelled) return;
        toast.error(`Failed to load configuration. error=${extractSplunkError(err)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSave || isSaving) return;

    setIsSaving(true);

    const payload = { "param.subject_prefix": prefixValue };

    // Run all updates. We keep them separate (same as your original behavior).
    const tasks = [
      axiosCallWrapper({
        endpointUrl: `configs/conf-alert_actions/cyences_send_email_action`,
        body: new URLSearchParams(payload),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      }),
      axiosCallWrapper({
        endpointUrl: `configs/conf-alert_actions/cyences_send_digest_email_action`,
        body: new URLSearchParams(payload),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      }),
      axiosCallWrapper({
        endpointUrl: `configs/conf-macros/${macroName}`,
        body: new URLSearchParams({ definition: prefixValue }),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      }),
      axiosCallWrapper({
        endpointUrl: `configs/conf-macros/${outsideWorkingHourMacro}`,
        body: new URLSearchParams({ definition: outsideWorkingHourValue }),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      }),
    ];

    const results = await Promise.allSettled(tasks);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length === 0) {
      toast.success("Saved successfully.");
    } else {
      // Show one concise error toast (prevents spam)
      const firstError = failed[0].reason;
      toast.error(`Save failed. error=${extractSplunkError(firstError)}`);
    }

    setIsSaving(false);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Card takes remaining height */}
      <div
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        style={{
          flex: "1 1 auto",
          minHeight: 0,          
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",      // prevents card from expanding page
        }}
      >
        {/* Header (fixed) */}
        <div className="mb-4 flex items-start justify-between gap-3" style={{ flex: "0 0 auto" }}>
          <div>
            <p className="mt-1 text-sm text-slate-600">
              Configure email environment naming and outside working hours rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            title="Reload"
          >
            Reload
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-64 rounded bg-slate-100" />
              <div className="h-10 w-full rounded-xl bg-slate-100" />
              <div className="h-4 w-72 rounded bg-slate-100" />
              <div className="h-10 w-full rounded-xl bg-slate-100" />
              <div className="h-10 w-24 rounded-xl bg-slate-100" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Environment Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium  font-bold">
                  {EmailConfigurationFields.emailSubjectLabel}
                  <span className="text-red-600"> *</span>
                </label>
                <p className="text-xs text-slate-500">{EmailConfigurationFields.emaiSubjectHelp}</p>
                <input
                  value={prefixValue}
                  onChange={(e) => setPrefixValue(e.target.value)}
                  placeholder="e.g., Prod, Staging, Customer-X"
                  className="w-full rounded-xl border border-black-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              {/* Outside Working Hours */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium  font-bold">
                  Outside Working Hours <span className="text-red-600"> *</span>
                </label>
                <p className="text-xs text-slate-500">
                  Definition for outside working hours (default is weekend + weekdays before 6am
                  and after 7pm).
                </p>
                <textarea
                  value={outsideWorkingHourValue}
                  onChange={(e) => setOutsideWorkingHourValue(e.target.value)}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-black-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="submit"
                  disabled={!canSave || isSaving}
                  className={[
                    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    !canSave || isSaving
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-slate-900 text-white hover:bg-slate-800",
                  ].join(" ")}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <div className="font-medium text-slate-800">What gets updated</div>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <code className="rounded bg-white px-1">cyences_send_email_action</code> and{" "}
                    <code className="rounded bg-white px-1">cyences_send_digest_email_action</code>{" "}
                    subject prefix
                  </li>
                  <li>
                    Macro <code className="rounded bg-white px-1">{macroName}</code> definition
                  </li>
                  <li>
                    Macro{" "}
                    <code className="rounded bg-white px-1">{outsideWorkingHourMacro}</code>{" "}
                    definition
                  </li>
                </ul>
              </div>

              {/* ✅ Keep footer inside scroll if you want it reachable */}
              <CyencesDocFooter location="install_configure/configuration/#cyences-general-setup" />
            </form>
          )}
        </div>
      </div>
    </div>
  );

}
