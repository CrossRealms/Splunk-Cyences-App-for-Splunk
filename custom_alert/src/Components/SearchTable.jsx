import React, { useEffect, useMemo, useState } from "react";
import Table from "@splunk/react-ui/Table";
import SearchJob from "@splunk/search-job";
import { app } from "@splunk/splunk-utils/config";
import Link from "@splunk/react-ui/Link";

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

  const rowCount = useMemo(() => (Array.isArray(data.results) ? data.results.length : 0), [data.results]);

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

      {/* Header bar (pure UI) */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>Results</div>
        <Pill>{rowCount} row{rowCount === 1 ? "" : "s"}</Pill>
      </div>

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
                  zIndex: 1,
                  background: "#fff",
                }}
              >
                {field.name}
              </Table.HeadCell>
            ))}
          </Table.Head>

          <Table.Body>
            {data.results?.map((row, index) => (
              <Table.Row key={index}>
                {data.fields?.map((field) => {
                  const key = `${index}-${field.name}`;
                  const val = row?.[field.name];

                  if (field.name === "Splunkbase Link" && val) {
                    return (
                      <Table.Cell key={key}>
                        <Link to={val} openInNewContext>
                          {val}
                        </Link>
                      </Table.Cell>
                    );
                  }

                  return <Table.Cell key={key}>{val ?? ""}</Table.Cell>;
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
