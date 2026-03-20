import React from "react";
import Link from "@splunk/react-ui/Link";
import Heading from "@splunk/react-ui/Heading";
import CyencesDocFooter from "./components/CyencesDocFooter";

function ActionCard({ title, description, href, delayMs = 0 }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        animation: `cyencesFadeUp 240ms ease-out ${delayMs}ms both`,
        transition: "transform 160ms ease, box-shadow 160ms ease",
      }}
      className="cyencesHoverCard"
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{title}</div>
        {description ? (
          <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{description}</div>
        ) : null}
      </div>

      <div style={{ padding: 16, display: "flex", justifyContent: "flex-end" }}>
        <Link
          to={href}
          openInNewContext
          style={{
            fontSize: 12,
            color: "#111827",
            textDecoration: "none",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          Open Search
        </Link>
      </div>
    </div>
  );
}

export default function DeviceInventorySetup() {
  return (
    <div style={{ height: "100%", minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cyencesHoverCard:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Scroll only inside the page area */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* page header */}
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
            <Heading style={{ margin: 0 }}>Device Inventory</Heading>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              Run the saved searches below to backfill or clean up device inventory related lookups.
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <ActionCard
              title="Backfill Device Inventory"
              description="Runs the saved search that backfills device inventory data."
              href="/en-GB/manager/cyences_app_for_splunk/saved/searches?app=cyences_app_for_splunk&count=100&offset=0&itemType=&owner=nobody&search=Device Inventory Backfill"
              delayMs={60}
            />

            <ActionCard
              title="CleanUp Device Inventory Related Lookup"
              description="Runs the saved search that cleans up device inventory lookup artifacts."
              href="/en-GB/manager/cyences_app_for_splunk/saved/searches?app=cyences_app_for_splunk&count=100&offset=0&itemType=&owner=nobody&search=Device Inventory Lookup CleanUp"
              delayMs={120}
            />
          </div>

          <CyencesDocFooter location="install_configure/configuration/#device-inventory" />
        </div>
      </div>
    </div>
  );
}
