import React, { useEffect, useMemo, useState, useCallback } from "react";
import CyencesDocFooter from "./components/CyencesDocFooter";
import { fetchProducts } from "./utils/api";
import NavBar from "./Components/NavBar";
import ProductSetup from "./Components/ProductSetup";

function getTabId(productInfo) {
  return productInfo?.label ? productInfo.label : productInfo?.name;
}

const styles = {
  wrap: {
    height: "100%",
    overflow: "hidden",  // prevents this page from expanding parent
    minHeight: 0,        //  critical inside parent flex scroll layouts
  },
  shell: {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "16px",
    alignItems: "stretch",
    overflow: "hidden",
    minHeight: 0,
  },

  sidebarCard: {
    height: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  sidebarHeader: {
    flex: "0 0 auto",
    padding: "12px 14px",
    borderBottom: "1px solid #e5e7eb",
  },
  sidebarTitle: { fontSize: "14px", fontWeight: 600, margin: 0, color: "#111827" },
  sidebarSub: { fontSize: "12px", margin: "4px 0 0", color: "#6b7280" },
  sidebarScroll: {
    flex: "1 1 auto",
    overflowY: "auto", //  scroll only here
    padding: "8px",
    minHeight: 0,
  },

  contentCard: {
    height: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    minWidth: 0,
  },
  contentHeader: {
    flex: "0 0 auto",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  contentTitle: { fontSize: "16px", fontWeight: 700, margin: 0, color: "#111827" },
  pill: {
    fontSize: "12px",
    color: "#111827",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "6px 10px",
    whiteSpace: "nowrap",
  },

  //  the ONLY scroll area for product content
  contentScroll: {
    flex: "1 1 auto",
    overflowY: "auto",
    padding: "16px",
    minHeight: 0,
  },

  stateBox: {
    border: "1px dashed #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    color: "#4b5563",
    background: "#fafafa",
    fontSize: "14px",
  },
  errorTitle: { margin: 0, fontWeight: 700, color: "#111827" },
  errorText: { margin: "6px 0 0" },
};

export default function ProductSetupApp() {
  const [products, setProducts] = useState(null);
  const [activeTabId, setActiveTabId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = useCallback((e, { selectedTabId }) => {
    setActiveTabId(selectedTabId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const resp = await fetchProducts();
        const data = JSON.parse(resp.data.entry?.[0]?.content?.products ?? "[]");

        if (cancelled) return;

        setProducts(data);

        const first = data?.[0];
        const firstTab = first ? getTabId(first) : "";
        setActiveTabId(firstTab);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setErrorMsg(err?.message ? String(err.message) : "Failed to load products.");
        setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => (products ?? []).map(getTabId).filter(Boolean), [products]);

  if (isLoading) {
    return <div style={styles.stateBox}>Loading products…</div>;
  }

  if (errorMsg) {
    return (
      <div style={styles.stateBox}>
        <p style={styles.errorTitle}>Couldn’t load products</p>
        <p style={styles.errorText}>{errorMsg}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div style={styles.stateBox}>No products found in configuration.</div>;
  }

  const activeLabel = activeTabId || getTabId(products[0]);

  return (
    <div style={styles.wrap}>
      <div style={styles.shell}>
        {/* Sidebar */}
        <aside style={styles.sidebarCard}>
          <div style={styles.sidebarHeader}>
            <p style={styles.sidebarTitle}>Products</p>
            <p style={styles.sidebarSub}>Select a product to configure</p>
          </div>

          <div style={styles.sidebarScroll}>
            <NavBar
              key="productMenu"
              activeTabId={activeTabId}
              handleChange={handleChange}
              items={items}
              layout="vertical"
            />
          </div>
        </aside>

        {/* Content */}
        <main style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <p style={styles.contentTitle}>Product Setup</p>
            <span style={styles.pill}>Active: {activeLabel}</span>
          </div>

          <div style={styles.contentScroll}>
            {/* ✅ Mode A: keep all mounted, hide with display */}
            {products.map((productInfo) => {
              const id = getTabId(productInfo);
              const visible = id === activeTabId;

              return (
                <div key={productInfo.name} style={{ display: visible ? "block" : "none" }}>
                  <ProductSetup productInfo={productInfo} />
                </div>
              );
            })}

            <div style={{ marginTop: 16 }}>
              <CyencesDocFooter location="install_configure/configuration/#products-setup-data-source-macros" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
