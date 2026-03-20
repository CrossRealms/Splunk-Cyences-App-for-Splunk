import React, { useEffect, useState } from "react";
import SimpleForm from "./components/SimpleForm";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { axiosCallWrapper } from "./utils/axiosCallWrapper";
import { toast } from "react-toastify";

const SOCAIFields = {
  usernameLabel: "Username",
  usernameHelp: "SOC AI Username",
  passwordLabel: "Password",
  passwordHelp: "SOC AI Password",
};

function extractSplunkError(error) {
  return error?.response?.data?.messages?.[0]?.text || error?.message || String(error);
}

function Card({ title, subtitle, children, delayMs = 0 }) {
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
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{title}</div>
        {subtitle ? (
          <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{subtitle}</div>
        ) : null}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </section>
  );
}

export default function SOCAIConfiguration() {

  const [data, setData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const resp = await axiosCallWrapper({ endpointUrl: `SOCAIConfiguration` });
        if (cancelled) return;

        const content = resp?.data?.entry?.[0]?.content ?? {};
        const { username = "" } = content;

        // keep existing behavior: do NOT show password from server
        setData({ username, password: "" });
      } catch (error) {
        if (cancelled) return;
        console.log(error);
        toast.error(`Failed to load SOC AI Configuration. error=${extractSplunkError(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function onSave(username, password) {
    const payload = JSON.stringify({ username, password });

    axiosCallWrapper({
      endpointUrl: `SOCAIConfiguration/soc_ai`,
      body: new URLSearchParams({ data: payload }),
      customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "post",
    })
      .then(() => {
        toast.success(`SOC AI configuration saved successfully`);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Failed to update SOC AI Configuration. error=${extractSplunkError(error)}`);
      });
  }

  return (
    <div style={{ height: "100%", minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* scrollable inner area (fits your layout rules) */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            // title="SOC AI API Configuration"
            subtitle="Store credentials used to integrate Cyences with SOC AI. Password is never displayed."
            delayMs={0}
          >
            {isLoading ? (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ height: 12, width: 220, borderRadius: 8, background: "#f3f4f6" }} />
                <div style={{ height: 40, width: "100%", borderRadius: 12, background: "#f3f4f6" }} />
                <div style={{ height: 12, width: 170, borderRadius: 8, background: "#f3f4f6" }} />
                <div style={{ height: 40, width: "100%", borderRadius: 12, background: "#f3f4f6" }} />
                <div style={{ height: 38, width: 120, borderRadius: 12, background: "#f3f4f6" }} />
              </div>
            ) : (
              <SimpleForm
                key="socai"
                {...SOCAIFields}
                onSave={onSave}
                username={data.username}
                password={data.password}
              />
            )}
          </Card>

          <CyencesDocFooter location="install_configure/configuration/#soc-ai-api-configuration" />
        </div>
      </div>
    </div>
  );
}
