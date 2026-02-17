import React, { useEffect, useState, useMemo } from "react";
import Button from "@splunk/react-ui/Button";
import Text from "@splunk/react-ui/Text";
import SearchTable from "./SearchTable";

export default function DataMacroConfiguration(props) {
  const {
    macroName,
    macroLabel,
    macroDefinition,
    defaultSearch,
    earliestTime,
    latestTime,
    updateMacroDefinition,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [earliestText, setEarliestText] = useState("");
  const [latestText, setLatestText] = useState("");
  const [earliest, setEarliest] = useState("");
  const [latest, setLatest] = useState("");

  // Keep behavior: initialize once on mount
  useEffect(() => {
    setSearchQuery(defaultSearch.replaceAll(`\`${macroName}\``, macroDefinition));
    setEarliest(earliestTime);
    setEarliestText(earliestTime);
    setLatest(latestTime);
    setLatestText(latestTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMacroChange(e, { value }) {
    updateMacroDefinition(macroName, value);
  }

  function updateSearchQuery() {
    setSearchQuery(defaultSearch.replaceAll(`\`${macroName}\``, macroDefinition));
    setEarliest(earliestText);
    setLatest(latestText);
  }

  const subtitle = useMemo(() => {
    return macroName ? `Macro: \`${macroName}\`` : "";
  }, [macroName]);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        background: "#fff",
        padding: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
            {macroLabel}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
            {subtitle}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <div style={{ flex: "1 1 520px", minWidth: "280px" }}>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Definition</div>
          <Text
            inline
            name="search"
            style={{ width: "100%" }}
            value={macroDefinition}
            onChange={handleMacroChange}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: "0 0 auto" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Earliest</div>
            <Text
              inline
              name="earliest"
              style={{ width: "110px" }}
              value={earliestText}
              onChange={(e, { value }) => setEarliestText(value)}
            />
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Latest</div>
            <Text
              inline
              name="latest"
              style={{ width: "110px" }}
              value={latestText}
              onChange={(e, { value }) => setLatestText(value)}
            />
          </div>

          <div style={{ paddingTop: "18px" }}>
            <Button label="Run Search" appearance="primary"
            style={{ background: "#111827", borderColor: "#111827" }}
            onClick={updateSearchQuery} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ marginTop: "12px" }}>
        {searchQuery !== "" ? (
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "12px",
              marginTop: "12px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>
              Preview results for the resolved search query
            </div>
            <SearchTable searchQuery={searchQuery} earliestTime={earliest} latestTime={latest} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
