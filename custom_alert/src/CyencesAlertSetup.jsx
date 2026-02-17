import React, { useEffect, useMemo, useState } from "react";
import Heading from "@splunk/react-ui/Heading";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { axiosCallWrapper } from "./utils/axiosCallWrapper";
import { MacroSetup } from "./MacroSetupApp";
import Switch from "@splunk/react-ui/Switch";
import { isTrue } from "./utils/util";
import { toast } from "react-toastify";

const SeparateDigestMacro = "cs_separate_digest_for_common_recipients";

const SOCTeamConfigurationMacros = [
  { name: "cs_soc_email", description: "comma separated list of email addresses of the SOC team/members" },
  { name: "cs_soc_immediate_alert_severities", description: "comma separated list of alert severity levels that are included in the email; default - critical severity only" },
  { name: "cs_soc_digest_alert_severities", description: "comma separated list of alert severity levels that are included in the email; default - high & medium severities" },
  { name: "cs_soc_alerts_to_exclude_from_digest_alert", description: "comma separated alert titles to exclude from alert digest email" },
  { name: "cs_soc_recipients_to_exclude_for_digest_alert", description: "comma separated recipients to exclude from alert digest email" },
];

const ComplianceTeamConfigurationMacros = [
  { name: "cs_compliance_email", description: "comma separated list of email addresses of the Compliance team/members." },
  { name: "cs_compliance_immediate_alert_severities", description: "comma separated list of alert severity levels that are included in the email; default - critical severity only" },
  { name: "cs_compliance_digest_alert_severities", description: "comma separated list of alert severity levels that are included in the email; default - high & medium severities" },
  { name: "cs_compliance_alerts_to_exclude_from_digest_alert", description: "comma separated alert titles to exclude from alert digest email" },
  { name: "cs_compliance_recipients_to_exclude_for_digest_alert", description: "comma separated recipients to exclude from alert digest email" },
];

function extractSplunkError(error) {
  return error?.response?.data?.messages?.[0]?.text || error?.message || String(error);
}

function SectionCard({ title, subtitle, badge, children, delayMs = 0 }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        animation: `cyencesFadeUp 260ms ease-out ${delayMs}ms both`,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{title}</div>
          {subtitle ? (
            <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{subtitle}</div>
          ) : null}
        </div>

        {badge ? (
          <div
            style={{
              flexShrink: 0,
              fontSize: 12,
              color: "#111827",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              padding: "6px 10px",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </div>
        ) : null}
      </div>

      <div style={{ padding: 16 }}>{children}</div>
    </section>
  );
}

export default function CyencesAlertSetup() {
  const [isEnabled, setEnabled] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // counts for nice little badges
  const socCount = useMemo(() => SOCTeamConfigurationMacros.length, []);
  const complianceCount = useMemo(() => ComplianceTeamConfigurationMacros.length, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const resp = await axiosCallWrapper({
          endpointUrl: `configs/conf-macros/${SeparateDigestMacro}`,
        });

        if (cancelled) return;

        setEnabled(isTrue(resp.data.entry?.[0]?.content?.definition));
      } catch (error) {
        if (cancelled) return;
        console.log(error);
        toast.error(`Failed to load "${SeparateDigestMacro}". error=${extractSplunkError(error)}`);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateMacro() {
    if (isEnabled === null || isSaving) return;

    setIsSaving(true);
    try {
      await axiosCallWrapper({
        endpointUrl: `configs/conf-macros/${SeparateDigestMacro}`,
        body: new URLSearchParams({ definition: String(!isEnabled) }),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      });

      toast.success(`Successfully updated "${SeparateDigestMacro}" macro.`);
      setEnabled((v) => !v);
    } catch (error) {
      toast.error(`Failed updated "${SeparateDigestMacro}" macro. error=${extractSplunkError(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  const toggleLabel =
    isEnabled === null
      ? "Loading..."
      : isSaving
      ? "Updating..."
      : isEnabled
      ? "Separate combined digest for common recipients"
      : "Common recipients receive both digests";

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* tiny CSS animation + subtle hover */}
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cyencesHoverCard:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Scrollable content area (fits your "no outer scroll" rule) */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* SOC */}
          <div className="cyencesHoverCard" style={{ transition: "transform 160ms ease, box-shadow 160ms ease" }}>
            <SectionCard
              title="SOC Team Configuration"
              subtitle="Macros controlling SOC recipients and alert severity selection."
              badge={`${socCount} macros`}
              delayMs={0}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SOCTeamConfigurationMacros.map((macroItem) => (
                  <MacroSetup
                    key={macroItem.name}
                    macroName={macroItem.name}
                    description={macroItem.description}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Compliance */}
          <div className="cyencesHoverCard" style={{ transition: "transform 160ms ease, box-shadow 160ms ease" }}>
            <SectionCard
              title="Compliance Team Configuration"
              subtitle="Macros controlling Compliance recipients and digest rules."
              badge={`${complianceCount} macros`}
              delayMs={60}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ComplianceTeamConfigurationMacros.map((macroItem) => (
                  <MacroSetup
                    key={macroItem.name}
                    macroName={macroItem.name}
                    description={macroItem.description}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Common recipients toggle */}
          <div className="cyencesHoverCard" style={{ transition: "transform 160ms ease, box-shadow 160ms ease" }}>
            <SectionCard
              title="Common Recipient Configuration"
              subtitle="Control how recipients shared between SOC and Compliance receive digests."
              badge={isEnabled === null ? "Loading" : isEnabled ? "Separate digest: ON" : "Separate digest: OFF"}
              delayMs={120}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  background: "#f9fafb",
                  padding: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>
                      Digest behavior for common recipients
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280", lineHeight: "18px" }}>
                      When enabled, common recipients won’t receive SOC and Compliance digests separately — they will
                      receive a single combined digest.
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 12, color: "#374151" }}>{toggleLabel}</div>
                    <Switch
                      inline
                      key={SeparateDigestMacro}
                      value={SeparateDigestMacro}
                      selected={Boolean(isEnabled)}
                      appearance="toggle"
                      onClick={updateMacro}
                      disabled={isEnabled === null || isSaving}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <CyencesDocFooter location="install_configure/configuration/#cyences-alerts-configuration" />
        </div>
      </div>
    </div>
  );
}
