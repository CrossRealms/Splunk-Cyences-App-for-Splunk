import React, { useEffect, useMemo, useState } from "react";
import ControlGroup from "@splunk/react-ui/ControlGroup";
import Button from "@splunk/react-ui/Button";
import Text from "@splunk/react-ui/Text";

function SimpleForm(props) {
  const {
    username = "Loading...",
    password = "",
    usernameLabel,
    usernameHelp = "",
    passwordLabel,
    passwordHelp = "",
    passwordType = "password",
    onSave,
    marginLeft = "none",
  } = props;

  const [user, setUser] = useState(username);
  const [pass, setPass] = useState(password);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = useMemo(() => {
    // Keep behavior permissive: allow saving even if username is "Loading..."
    // But we’ll disable only if onSave missing or saving in progress.
    return typeof onSave === "function" && !isSaving;
  }, [onSave, isSaving]);

  useEffect(() => setUser(username), [username]);
  useEffect(() => setPass(password), [password]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    try {
      setIsSaving(true);
      // keep exact behavior: pass current state
      onSave(user, pass);
    } finally {
      // We don't know when the caller finishes; keep it snappy.
      // (If you want, we can make parent pass a saving prop later.)
      setTimeout(() => setIsSaving(false), 350);
    }
  }

  return (
    <div
      style={{
        marginTop: 8,
        marginLeft,
        maxWidth: 720,
        animation: "cyencesFadeUp 240ms ease-out both",
      }}
    >
      <style>{`
        @keyframes cyencesFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>
                Credentials
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
                Update username and password, then save.
              </div>
            </div>

            <Button
              style={{ maxWidth: 120, background: "#111827", borderColor: "#111827" }}
              type="submit"
              label={isSaving ? "Saving..." : "Save"}
              appearance="primary"
              disabled={!canSave}
            />
          </div>

          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <ControlGroup required={true} label={usernameLabel} help={usernameHelp}>
              <Text
                inline={false}
                name="username"
                value={user}
                onChange={(e, { value }) => setUser(value)}
                style={{ width: "100%" }}
              />
            </ControlGroup>

            <ControlGroup required={true} label={passwordLabel} help={passwordHelp}>
              <Text
                inline={false}
                name="password"
                type={passwordType}
                value={pass}
                onChange={(e, { value }) => setPass(value)}
                style={{ width: "100%" }}
              />
            </ControlGroup>

            {/* Optional helper row */}
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                borderTop: "1px solid #f3f4f6",
                paddingTop: 10,
              }}
            >
              Tip: password is not displayed after load for security.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SimpleForm;
