import React, { useEffect, useMemo, useState, useCallback } from "react";
import Button from "@splunk/react-ui/Button";
import Text from "@splunk/react-ui/Text";
import ControlGroup from "@splunk/react-ui/ControlGroup";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { axiosCallWrapper } from "./utils/axiosCallWrapper";
import allMacros from "./allMacros";
import { toast } from "react-toastify";
import NavBar from "./Components/NavBar";

function extractSplunkError(error) {
  return error?.response?.data?.messages?.[0]?.text || error?.message || String(error);
}

const styles = {
  page: {
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 16,
    alignItems: "stretch",
  },

  sidebar: {
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid #e5e7eb",
  },
  sidebarTitle: { margin: 0, fontSize: 14, fontWeight: 800, color: "#111827" },
  sidebarSub: { margin: "4px 0 0", fontSize: 12, color: "#6b7280" },
  sidebarScroll: {
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    padding: 8,
  },

  content: {
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  contentHeader: {
    flex: "0 0 auto",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  contentTitle: { margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" },
  pill: {
    fontSize: 12,
    color: "#111827",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "6px 10px",
    whiteSpace: "nowrap",
  },
  contentScroll: {
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    padding: 16,
  },

  sectionCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  sectionHead: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  sectionName: { margin: 0, fontSize: 14, fontWeight: 800, color: "#111827" },
  sectionHint: { margin: "4px 0 0", fontSize: 12, color: "#6b7280" },
  sectionBody: { padding: 16 },

  empty: {
    border: "1px dashed #e5e7eb",
    borderRadius: 14,
    padding: 16,
    background: "#fafafa",
    color: "#4b5563",
    fontSize: 14,
  },
};

export function MacroSetup({ macroName, description = "" }) {

  const [macro, setMacro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const resp = await axiosCallWrapper({
          endpointUrl: `configs/conf-macros/${macroName}`,
        });

        if (cancelled) return;

        const def = resp?.data?.entry?.[0]?.content?.definition ?? "";
        setMacro(def);
      } catch (error) {
        if (cancelled) return;
        toast.error(`Failed to load "${macroName}". error=${extractSplunkError(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [macroName]);

  async function updateMacro() {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await axiosCallWrapper({
        endpointUrl: `configs/conf-macros/${macroName}`,
        body: new URLSearchParams({ definition: macro }),
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
      });

      toast.success(`Successfully updated "${macroName}" macro.`);
    } catch (error) {
      toast.error(`Failed updated "${macroName}" macro. error=${extractSplunkError(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 12,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{macroName}</div>
          {description ? (
            <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{description}</div>
          ) : null}
        </div>

        <Button
          label={isSaving ? "Updating..." : "Update"}
          appearance="primary"
          style={{ maxWidth: 110, background: "#111827", borderColor: "#111827" }}
          onClick={updateMacro}
          disabled={isLoading || isSaving}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        {/* Keep Splunk Text input so behavior matches your existing UI */}
        <ControlGroup label="" help="">
          <Text
            inline={false}
            value={isLoading ? "Loading..." : macro}
            onChange={(e, { value }) => setMacro(value)}
            disabled={isLoading}
            style={{ width: "100%" }}
          />
        </ControlGroup>
      </div>
    </div>
  );
}

export default function MacroSetupApp() {
  const sections = useMemo(() => allMacros?.map((x) => x.section).filter(Boolean) ?? [], []);
  const [activeTabId, setActiveTabId] = useState(sections[0] ?? "");

  const handleChange = useCallback((e, { selectedTabId }) => {
    setActiveTabId(selectedTabId);
  }, []);

  const activeSection = useMemo(() => {
    return allMacros?.find((s) => s.section === activeTabId) ?? allMacros?.[0] ?? null;
  }, [activeTabId]);

  const activeCount = activeSection?.macros?.length ?? 0;

  return (
    <div style={styles.page}>
      {/* LEFT: section nav */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <p style={styles.sidebarTitle}>Macro setup</p>
          <p style={styles.sidebarSub}>Choose a category to edit macros</p>
        </div>

        <div style={styles.sidebarScroll}>
          <NavBar
            key="macroMenu"
            activeTabId={activeTabId}
            handleChange={handleChange}
            items={sections}
            layout="vertical"
          />
        </div>
      </aside>

      {/* RIGHT: content */}
      <main style={styles.content}>
        <div style={styles.contentHeader}>
          <p style={styles.contentTitle}>{activeTabId || "Macros"}</p>
          <span style={styles.pill}>{activeCount} macros</span>
        </div>

        <div style={styles.contentScroll}>
          {activeSection ? (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHead}>
                <p style={styles.sectionName}>Edit macros</p>
                <p style={styles.sectionHint}>
                  Update definitions and save each macro individually.
                </p>
              </div>

              <div style={styles.sectionBody}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeSection.macros?.map((macroItem) => (
                    <MacroSetup
                      key={macroItem.name}
                      macroName={macroItem.name}
                      description={macroItem.description}
                    />
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <CyencesDocFooter location="install_configure/configuration/#macro-setup" />
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.empty}>No macro sections found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
