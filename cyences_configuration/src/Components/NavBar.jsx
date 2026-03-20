import React, { useMemo } from "react";

function fireChange(handleChange, selectedTabId) {
  handleChange?.(null, { selectedTabId });
}

export default function NavBar({
  activeTabId,
  handleChange,
  items = [],
  layout = "vertical",
  compact = false,
}) {
  const list = useMemo(() => items.filter(Boolean), [items]);

  if (layout === "horizontal") {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {list.map((item) => {
            const active = item === activeTabId;

            return (
              <button
                key={item}
                type="button"
                onClick={() => fireChange(handleChange, item)}
                style={{
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  background: active ? "#111827" : "#fff",
                  color: active ? "#fff" : "#111827",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: 6,
        }}
      >
        {list.map((item) => {
          const active = item === activeTabId;

          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => fireChange(handleChange, item)}
                title={compact ? item : undefined}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 12,
                  padding: compact ? "10px 10px" : "10px 12px",
                  border: "1px solid transparent",
                  background: active ? "#111827" : "transparent",
                  color: active ? "#fff" : "#111827",
                  cursor: "pointer",
                }}
              >
                {/* Indicator Dot */}
                <span
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    background: active ? "#fff" : "#d1d5db",
                    flexShrink: 0,
                  }}
                />

                {!compact ? (
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>
                    {item}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.85 }}>
                    {item?.[0] ?? ""}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
