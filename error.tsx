"use client";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 60%, #dbeafe 100%)",
        color: "#1e293b",
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Logo added here */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          textDecoration: "none",
        }}
        aria-label="Homepage"
      >
        <img
          src="/Logo.jpg"
          alt="Site Logo"
          style={{
            height: "48px",
            width: "48px",
            marginRight: "0.75rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
            background: "#fff",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.7rem",
            color: "#2563eb",
            letterSpacing: "-0.03em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Essa.store
        </span>
      </a>
      
      <h1 style={{ fontSize: "4rem", margin: 0, fontWeight: 800, letterSpacing: "-0.05em" }}>404</h1>
      <h2 style={{ fontSize: "2rem", margin: "1rem 0 0.5rem 0", fontWeight: 600 }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: "2rem", color: "#64748b", maxWidth: "340px", textAlign: "center" }}>
        Sorry, the page you are looking for does not exist or has been moved.<br />
        Please check the URL or return to the homepage.
      </p>
      <a
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          background: "linear-gradient(90deg, #2563eb 60%, #1d4ed8 100%)",
          color: "#fff",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1.1rem",
          boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLAnchorElement).style.background =
            "linear-gradient(90deg, #1d4ed8 60%, #2563eb 100%)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow =
            "0 4px 16px rgba(37,99,235,0.15)";
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLAnchorElement).style.background =
            "linear-gradient(90deg, #2563eb 60%, #1d4ed8 100%)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow =
            "0 2px 8px rgba(37,99,235,0.08)";
        }}
      >
        Go Home
      </a>
      <div style={{ marginTop: "2.5rem", color: "#94a3b8", fontSize: "0.95rem" }}>
        <span style={{ fontWeight: 500 }}>UX Design tip:</span> If you think this is a mistake, please{" "}
        <a
          href="mailto:support@example.com"
          style={{
            color: "#2563eb",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          contact support
        </a>
        .
      </div>
    </div>
  );
}
