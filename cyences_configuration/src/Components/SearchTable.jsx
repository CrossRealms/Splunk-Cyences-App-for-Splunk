import React, { useEffect, useState } from "react";
import Table from "@splunk/react-ui/Table";
import SearchJob from "@splunk/search-job";
import { app } from "@splunk/splunk-utils/config";
import Link from "@splunk/react-ui/Link";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function Pill({ children }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#111827",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        borderRadius: 999,
        padding: "4px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function StateBox({ variant = "neutral", title, children }) {
  const palette =
    variant === "error"
      ? { border: "#fecaca", bg: "#fff1f2", fg: "#991b1b" }
      : { border: "#e5e7eb", bg: "#fafafa", fg: "#6b7280" };

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        background: palette.bg,
        padding: 12,
        color: palette.fg,
        fontSize: 14,
        animation: "cyencesFadeUp 180ms ease-out both",
      }}
    >
      {title ? <div style={{ fontWeight: 800, marginBottom: 4 }}>{title}</div> : null}
      {children}
    </div>
  );
}

export default function SearchTable({ searchQuery, earliestTime, latestTime }) {
  const [data, setData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

const parseImportantFields = (importantFields = []) => {
  return importantFields.map((item) => {
    const [field, field_count, distinct_count, values, coverage, min_coverage] = item.split("||");

    let parsedValues = [];
    try {
      parsedValues = JSON.parse(values || "[]");
    } catch {
      parsedValues = [];
    }

    return {
      field,
      field_count,
      distinct_count,
      values: parsedValues,
      coverage,
      min_coverage
    };
  });
};

  useEffect(() => {
    let isCancelled = false;

    setData({});
    setErrorMsg("");

    const mySearchJob = SearchJob.create(
      {
        search: searchQuery,
        earliest_time: earliestTime,
        latest_time: latestTime,
      },
      { app, cache: false }
    );

    const resultsSubscription = mySearchJob.getResults().subscribe({
      next: (results) => {
        if (!isCancelled) setData(results);
      },
      error: (err) => {
        if (!isCancelled) {
          setErrorMsg(err?.message ? String(err.message) : "Search failed.");
        }
      },
    });

    return () => {
      isCancelled = true;
      try {
        resultsSubscription.unsubscribe();
      } catch {
        // ignore
      }
      // mySearchJob.cancel?.(); // optional if supported in your version
    };
  }, [searchQuery, earliestTime, latestTime]);

  // const rowCount = useMemo(() => (Array.isArray(data.results) ? data.results.length : 0), [data.results]);

  // Loading
  if (data.results === undefined && !errorMsg) {
    return (
      <div>
        <style>{`
          @keyframes cyencesFadeUp { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
          @keyframes cyencesPulse { 0%,100% {opacity: .55;} 50% {opacity: 1;} }
        `}</style>

        <StateBox title="Running search…">
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ height: 10, width: 220, borderRadius: 8, background: "#e5e7eb", animation: "cyencesPulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: 34, width: "100%", borderRadius: 12, background: "#e5e7eb", animation: "cyencesPulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: 34, width: "100%", borderRadius: 12, background: "#e5e7eb", animation: "cyencesPulse 1.2s ease-in-out infinite" }} />
          </div>
        </StateBox>
      </div>
    );
  }

  // Error
  if (errorMsg) {
    return (
      <div>
        <style>{`
          @keyframes cyencesFadeUp { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        `}</style>
        <StateBox variant="error" title="Search failed">
          {errorMsg}
        </StateBox>
      </div>
    );
  }

  // Empty
  if (Array.isArray(data.results) && data.results.length === 0) {
    return (
      <div>
        <style>{`
          @keyframes cyencesFadeUp { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        `}</style>
        <StateBox title="No results">
          Try adjusting the query or the time range.
        </StateBox>
      </div>
    );
  }

  const getChipStyle = (coverage, minCoverage) => {
  if (coverage === "-") {
    return {
      background: "#e5e7eb",
      color: "#374151",
      border: "1px solid #d1d5db",
    };
  }

  const cov = parseFloat(coverage);
  const minCov = parseFloat(minCoverage);

  if (cov >= minCov) {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  return {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  };
};

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        animation: "cyencesFadeUp 200ms ease-out both",
      }}
    >
      <style>{`
        @keyframes cyencesFadeUp { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
      `}</style>  

      {/* Horizontal scroll if many columns */}
      <div style={{ overflowX: "auto" }}>
        <Table stripeRows>
          <Table.Head>
            {data.fields?.map((field) => (
              <Table.HeadCell
                key={field.name}
                 style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  background: "#fff",
                  fontWeight: 700,         
                  fontSize: 14,            
                  color: "#111827",
                  padding: "12px 14px",
                  borderBottom: "2px solid #e5e7eb",
                  letterSpacing: "0.3px",
                }}
              >
                {field.name}
              </Table.HeadCell>
            ))}
          </Table.Head>

          <Table.Body>
            {data.results?.map((row, index) => {
              const importantFields = row?.important_fields || [];
              const parsedFields = parseImportantFields(importantFields);

              return (
                <React.Fragment key={index}>
                  {/* MAIN ROW */}
                  <Table.Row>
                    {data.fields
                      ?.filter((field) => field.name !== "important_fields") 
                      .map((field) => {
                        const key = `${index}-${field.name}`;
                        const val = row?.[field.name];

                        return <Table.Cell key={key}>{val ?? ""}</Table.Cell>;
                      })}

                    {/* NEW COLUMN BUTTON */}
                    {importantFields.length > 0 && (
                    <Table.Cell>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {parsedFields.map((item, i) => {
                          const chipStyle = getChipStyle(item.coverage, item.min_coverage);

                          return (
                            <Tooltip
                              key={i}
                              arrow
                              placement="top"
                              title={
                                <div style={{ padding: 8, maxWidth: 260 }}>
                                  <div style={{ fontSize: 12, marginBottom: 6 }}>
                                    <strong>Distinct Count:</strong> {item.distinct_count}
                                  </div>
                                  <div style={{ fontSize: 12, marginBottom: 6 }}>
                                    <strong>Field Values:</strong>
                                  </div>
                                  <div style={{ maxHeight: 150, overflowY: "auto" }}>
                                    {item.values.map((val, idx) => (
                                      <div key={idx} style={{ fontSize: 12 }}>
                                        {val.value} ({val.count})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              }
                            >
                              <span
                                style={{
                                  ...chipStyle,
                                  fontSize: 11,
                                  borderRadius: 999,
                                  padding: "4px 7px",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  fontWeight: 500,
                                }}
                              >
                                {item.field} - {Number(item.coverage).toFixed(0)}%
                              </span>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </Table.Cell>
                    )}
                  </Table.Row>

                  
                  <Table.Row>
                    <Table.Cell colSpan={data.fields.length + 1} style={{ padding: 0 }}>
                      <div
                        style={{
                          height: 1,
                          background: "#e5e7eb",
                          width: "100%",
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                </React.Fragment>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
