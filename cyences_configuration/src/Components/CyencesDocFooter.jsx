import React from "react";
import Link from "@splunk/react-ui/Link";

export default function CyencesDocFooter({ location }) {
  if (!location) return null;

  return (
    <footer
      style={{
        marginTop: 16, 
        paddingTop: 12,
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Link
        to={`https://cyences.com/${location}`}
        openInNewContext
        style={{
          fontSize: 12,
          color: "#374151",
          textDecoration: "none",
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        Configuration Documentation
      </Link>
    </footer>
  );
}
