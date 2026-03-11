import React, { useCallback, useState } from "react";

import CyencesGeneralConfiguration from "./CyencesGeneralConfiguration";
import ProductSetupApp from "./ProductSetupApp";
import MacroSetupApp from "./MacroSetupApp";
import CyencesAlertSetup from "./CyencesAlertSetup";
import DeviceInventorySetup from "./DeviceInventorySetup";
import UserInventorySetup from "./UserInventorySetup";
import CyencesDependencies from "./CyencesDependencies";
import SOCAIConfiguration from "./SOCAIConfiguration";
import { BlockShieldAPIConfiguration } from "./BlockShieldAPIConfiguration";
import NavBar from "./Components/NavBar";

const TABS = [
    "Cyences General Configuration",
    "Products Setup",
    "Macro Setup",
    "Cyences Alerts Configuration",
    "BlockShield API Configuration",
    "SOC AI API Configuration",
    "Device Inventory Configuration",
    "User Inventory Configuration",
    "Cyences Dependencies",
];

export default function ProductSetupPage() {
    const [activeTabId, setActiveTabId] = useState(TABS[0]);
    const [isMainNavCollapsed, setIsMainNavCollapsed] = useState(false);

    const handleChange = useCallback((e, { selectedTabId }) => {
        setActiveTabId(selectedTabId);
    }, []);

    const shell = {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateColumns: isMainNavCollapsed ? "64px 1fr" : "280px 1fr",
        gap: "16px",
        alignItems: "stretch",
        overflow: "hidden",
        minHeight: 0,
    };



    const sidebar = {
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // ✅ critical
    };


    const sidebarHeader = {
        padding: "10px 12px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    };

    const iconBtn = {
        border: "1px solid #e5e7eb",
        background: "#fff",
        borderRadius: 12,
        padding: "6px 10px",
        fontSize: 12,
        cursor: "pointer",
        color: "#111827",
        whiteSpace: "nowrap",
    };

    const contentCard = {
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // critical
    };


    const contentHeader = {
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    };

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                 height: "calc(100vh - 80px)",
                overflow: "hidden",
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
            }}
        >

            <div
                style={{
                    flex: "1 1 auto",
                    minHeight: 0,
                    padding: 16,
                    maxWidth: 1400,
                    width: "100%",
                    height: "100%",
                    margin: "0 auto",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    display: "flex",
                }}
            >


                <div style={shell}>
                    {/* MAIN SIDEBAR */}
                    <aside style={sidebar}>
                        <div style={sidebarHeader}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                <div style={{ fontWeight: 800, color: "#111827", fontSize: 13 }}>
                                    {isMainNavCollapsed ? "C" : "Cyences"}
                                </div>
                            </div>

                            <button
                                type="button"
                                style={iconBtn}
                                onClick={() => setIsMainNavCollapsed((v) => !v)}
                                title={isMainNavCollapsed ? "Expand menu" : "Collapse menu"}
                            >
                                {isMainNavCollapsed ? "»" : "«"}
                            </button>
                        </div>

                        {/* Scrollable menu area */}
                        <div style={{ flex: "1 1 auto", overflowY: "auto", padding: 8, minHeight: 0 }}>
                            <NavBar
                                activeTabId={activeTabId}
                                handleChange={handleChange}
                                items={TABS}
                                layout="vertical"
                                compact={isMainNavCollapsed}
                            />

                        </div>

                    </aside>

                    {/* CONTENT */}
                    <main style={contentCard}>
                        <div style={contentHeader}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                {activeTabId}
                            </div>

                            {/* Optional: quick expand button when collapsed */}
                            {isMainNavCollapsed ? (
                                <button
                                    type="button"
                                    style={iconBtn}
                                    onClick={() => setIsMainNavCollapsed(false)}
                                >
                                    Expand menu
                                </button>
                            ) : null}
                        </div>

                        <div style={{ flex: "1 1 auto", overflow: "hidden", padding: 16, minHeight: 0 }}>
                            <div style={{ height: "100%", minHeight: 0 }}>

                                {/* Mode A: keep all mounted, just hide via display */}
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[0] ? "block" : "none" }}>
                                    <CyencesGeneralConfiguration />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[1] ? "block" : "none" }}>
                                    <ProductSetupApp />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[2] ? "block" : "none" }}>
                                    <MacroSetupApp />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[3] ? "block" : "none" }}>
                                    <CyencesAlertSetup />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[4] ? "block" : "none" }}>
                                    <BlockShieldAPIConfiguration />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[5] ? "block" : "none" }}>
                                    <SOCAIConfiguration />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[6] ? "block" : "none" }}>
                                    <DeviceInventorySetup />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[7] ? "block" : "none" }}>
                                    <UserInventorySetup />
                                </div>
                                <div style={{ height: "100%", minHeight: 0, display: activeTabId === TABS[8] ? "block" : "none" }}>
                                    <CyencesDependencies />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
