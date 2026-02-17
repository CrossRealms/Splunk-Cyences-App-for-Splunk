import React, { useMemo } from "react";
import Heading from "@splunk/react-ui/Heading";
import CyencesDocFooter from "./components/CyencesDocFooter";
import SearchTable from "./Components/SearchTable";

const searchQuery = `| rest /services/apps/local splunk_server=local 
| search label IN ("Splunk Common Information Model", "Flow Map Viz") 
| eval is_installed="Installed" 
| table label, is_installed, disabled
| append 
    [| makeresults count=1 
    | eval label="Splunk Common Information Model", disabled="-", is_installed="Not Installed", link="https://splunkbase.splunk.com/app/1621/", reason="For data models"
    | table label, is_installed, disabled, link, reason] 
| append 
    [| makeresults count=1 
    | eval label="Flow Map Viz", disabled="-", is_installed="Not Installed", link="https://splunkbase.splunk.com/app/4657/", reason="For internal network traffic visualization"
    | table label, is_installed, disabled, link, reason] 
| stats first(*) as * by label 
| eval disabled = case(disabled=0, "Enabled", disabled=1, "Disabled", 1==1, "-") 
| table label, is_installed, disabled, link, reason
| rename label as "App Name", is_installed as "Installation Status", link as "Splunkbase Link", disabled as "Enabled/Disabled", reason as "What is this used for?"
`;

function Card({ title, subtitle, right, children, delayMs = 0 }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        animation: `cyencesFadeUp 240ms ease-out ${delayMs}ms both`,
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
        {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
      </div>

      <div style={{ padding: 16 }}>{children}</div>
    </section>
  );
}

export default function CyencesDependencies() {
  // purely UI label count (not touching functionality)
  const knownApps = useMemo(() => 2, []);

  return (
    <div style={{ height: "100%", minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Scroll only inside this page */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              padding: 16,
              animation: "cyencesFadeUp 240ms ease-out both",
            }}
          >
            <Heading style={{ margin: 0 }}>Cyences Dependencies</Heading>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              This table checks whether required Splunk apps are installed and enabled. If missing, use the Splunkbase
              link to install.
            </div>
          </div>

          {/* Table Card */}
          <Card
            title="App Dependencies"
            subtitle="Installation status and links for required apps."
            right={
              <span
                style={{
                  fontSize: 12,
                  color: "#111827",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "6px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                {knownApps} known apps
              </span>
            }
            delayMs={60}
          >
            {/* SearchTable behavior remains identical */}
            <SearchTable searchQuery={searchQuery} />
          </Card>

          <CyencesDocFooter location="install_configure/configuration/#cyences-dependencies" />
        </div>
      </div>
    </div>
  );
}
