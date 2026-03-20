import React, { useEffect, useState } from "react";
import SimpleForm from "./components/SimpleForm";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { axiosCallWrapper } from "./utils/axiosCallWrapper";
import { toast } from "react-toastify";

const BlockShieldFields = {
  usernameLabel: "Username",
  usernameHelp: "BlockShield Username",
  passwordLabel: "Password",
  passwordHelp: "BlockShield Password",
};

function extractSplunkError(error) {
  return error?.response?.data?.messages?.[0]?.text || error?.message || String(error);
}

function Card({ title, subtitle, right, children, delayMs = 0 }) {
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

export const BlockShieldAPIConfiguration = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const resp = await axiosCallWrapper({ endpointUrl: `BlockShieldConfiguration` });
        if (cancelled) return;

        const content = resp?.data?.entry?.[0]?.content ?? {};
        const { username = "" } = content;

        // keep existing behavior: never show password
        setData({ username, password: "" });
      } catch (error) {
        if (cancelled) return;
        toast.error(`Failed to load BlockShield Configuration. error=${extractSplunkError(error)}`);
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
      endpointUrl: `BlockShieldConfiguration/blockshield`,
      body: new URLSearchParams({ data: payload }),
      customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "post",
    })
      .then(() => {
        toast.success(`BlockShield configuration saved successfully`);
      })
      .catch((error) => {
        toast.error(`Failed to update BlockShield Configuration. error=${extractSplunkError(error)}`);
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

      {/* Scrollable content area (fits your current layout model) */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            // title="BlockShield API Configuration"
            subtitle="Store credentials used to integrate Cyences with BlockShield. Password is never displayed."
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
                key="blockshield"
                {...BlockShieldFields}
                onSave={onSave}
                username={data.username}
                password={data.password}
              />
            )}
          </Card>

          <CyencesDocFooter location="install_configure/configuration/#blockshield-api-configuration" />
        </div>
      </div>
    </div>
  );
};
