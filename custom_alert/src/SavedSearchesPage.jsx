import React, { useMemo, useState } from "react";
import SavedSearchesHeader from "./Components/SavedSearchesHeader";
import SavedSearchesTable from "./Components/SavedSearchesTable";
import useSavedSearches from "./hooks/useSavedSearch";
import { CircularProgress } from "@mui/material";

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
      {(title || subtitle || right) ? (
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
            {title ? (
              <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{title}</div>
            ) : null}
            {subtitle ? (
              <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{subtitle}</div>
            ) : null}
          </div>
          {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
        </div>
      ) : null}

      <div style={{ padding: 16 }}>{children}</div>
    </section>
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
      {title ? <div style={{ fontWeight: 900, marginBottom: 4 }}>{title}</div> : null}
      {children}
    </div>
  );
}

export default function SavedSearchesPage() {
  const { data, loading, error, refetch } = useSavedSearches();
  const [filter, setFilter] = useState("");

  const filteredRows = useMemo(() => {
    if (!filter) return data;
    return data.filter((row) => row.title?.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  return (
    <div style={{ height: "100%", minHeight: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Loading overlay (same behavior, better styling w/out tailwind) */}
      {loading ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(2px)",
          }}
        >
          <CircularProgress size={28} />
        </div>
      ) : null}

      {/* Scrollable inner area (fits your no-outer-scroll layout) */}
      <div style={{ height: "100%", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Page header card */}

          {/* Error state */}
          {error ? (
            <StateBox variant="error" title="Error loading saved searches">
              Please try refresh.
            </StateBox>
          ) : null}

          {/* Main content card */}
          {!error ? (
            <Card
              delayMs={60}
            >
              {/* keep exact components/props */}
              <div style={{ marginBottom: 12 }}>
                <SavedSearchesHeader
                  filter={filter}
                  onFilterChange={setFilter}
                  refetch={refetch}
                />
              </div>

              <SavedSearchesTable rows={filteredRows} refetch={refetch} />
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}