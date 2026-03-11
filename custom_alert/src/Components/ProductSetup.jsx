import React, { useMemo, useState } from "react";
import Button from "@splunk/react-ui/Button";
import Switch from "@splunk/react-ui/Switch";
import Heading from "@splunk/react-ui/Heading";
import DataMacroConfiguration from "./DataMacroConfiguration";
import SearchTable from "./SearchTable";
import { saveProductConfig } from "../utils/api";
import { toast } from "react-toastify";

// Keep your existing spinner css for now
import "../css/spinner.css";

function extractSplunkError(error) {
  return error?.response?.data?.messages?.[0]?.text || error?.message || String(error);
}

function effectiveEnabled(enabled) {
  const str = String(enabled).toLowerCase();
  if (str === "unknown") return [false, "Unknown"];
  return [Boolean(enabled), enabled ? "Enabled" : "Disabled"];
}

function Card({ title, subtitle, children, right }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {(title || subtitle || right) && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ marginTop: "2px", fontSize: "12px", color: "#6b7280" }}>
                {subtitle}
              </div>
            )}
          </div>
          {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
        </div>
      )}

      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

export default function ProductSetup({ productInfo }) {

  const [enabled, setEnabled] = useState(productInfo.enabled);
  const [macros, setMacros] = useState(productInfo.macro_configurations);
  const [response, setResponse] = useState("");

  const [isToggling, setIsToggling] = useState(false);
  const [isSavingMacros, setIsSavingMacros] = useState(false);

  const productTitle = useMemo(
    () => (productInfo.label ? productInfo.label : productInfo.name),
    [productInfo.label, productInfo.name]
  );

  const [finalEnabled, enabledLabel] = effectiveEnabled(enabled);

  function updateMacroDefinition(macro, definition) {
    setMacros((prev) =>
      prev.map((item) =>
        macro === item.macro_name ? { ...item, macro_definition: definition } : item
      )
    );
  }

  async function changeEnabled() {
    if (isToggling) return;

    const payload = {
      product: productInfo.name,
      enabled: !finalEnabled,
    };

    setIsToggling(true);
    setResponse("");

    try {
      const resp = await saveProductConfig(payload);
      toast.success(`Successfully ${payload.enabled ? "enabled" : "disabled"} "${payload.product}".`);
      setEnabled(payload.enabled);
      setResponse(resp?.data?.entry?.[0]?.content?.message ?? "");
    } catch (error) {
      const msg = extractSplunkError(error);
      toast.error(`Failed to update "${payload.product}". error=${msg}`);
    } finally {
      setIsToggling(false);
    }
  }

  async function saveMacros() {
    if (isSavingMacros) return;

    const payload = {
      product: productInfo.name,
      macro_configurations: macros,
    };

    setIsSavingMacros(true);
    setResponse("");

    try {
      await saveProductConfig(payload);
      toast.success(`Successfully updated "${payload.product}" macros.`);
    } catch (error) {
      const msg = extractSplunkError(error);
      toast.error(`Failed to update "${payload.product}" macros. error=${msg}`);
    } finally {
      setIsSavingMacros(false);
    }
  }

  const dependencyQuery = String(productInfo.app_dependency_search ?? "").trim();
  const showDependencies = dependencyQuery.length > 0;

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header / Status */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>
          {productTitle}
        </div>
        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Switch
            inline
            key={productInfo.name}
            value={productInfo.name}
            selected={finalEnabled}
            appearance="toggle"
            onClick={changeEnabled}
            disabled={isToggling}
          >
            {isToggling ? "Updating..." : enabledLabel}
          </Switch>

          {(isToggling || isSavingMacros) && <div id="spinner" />}
        </div>
      </div>

      {/* Macro configuration */}
      <Card
        title="Data source macros"
        subtitle="Review and adjust macro definitions used by this product."
        right={
          <Button
            label={isSavingMacros ? "Saving..." : "Save macros"}
            appearance="primary"
            style={{ background: "#111827", borderColor: "#111827" }}
            onClick={saveMacros}
            disabled={isSavingMacros}
          />
        }
      >
        {macros?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {macros.map((item) => (
              <DataMacroConfiguration
                key={item.macro_name}
                macroName={item.macro_name}
                macroLabel={item.label}
                macroDefinition={item.macro_definition}
                defaultSearch={item.search}
                earliestTime={item.earliest_time}
                latestTime={item.latest_time}
                updateMacroDefinition={updateMacroDefinition}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            No macros configured for this product.
          </div>
        )}

        {response ? (
          <div
            style={{
              marginTop: "14px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "12px",
              color: "#111827",
              overflowX: "auto",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Server response</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{response}</pre>
          </div>
        ) : null}
      </Card>

      {/* Dependencies */}
      {showDependencies ? (
        <Card className="!pt-4" title="App dependencies" subtitle="Apps required by this product configuration.">
          <SearchTable searchQuery={dependencyQuery} />
        </Card>
      ) : null}
    </div>
  );
}
