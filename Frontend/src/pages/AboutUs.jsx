import React from "react";

const AboutUs = () => {
  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", color: "var(--accent-gold)" }}>
          About Smart Campus
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "700px",
            margin: "1rem auto",
            lineHeight: "1.6",
          }}
        >
          Smart Campus Operations Hub is a centralized platform designed to
          simplify campus resource management, streamline bookings, and enhance
          maintenance workflows.
        </p>
      </div>

      {/* Mission & Vision */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div className="glass-panel">
          <h2 style={{ color: "var(--accent-gold)" }}>Our Mission</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            To empower educational institutions with efficient digital tools
            that improve operational transparency, reduce conflicts, and enhance
            productivity.
          </p>
        </div>

        <div className="glass-panel">
          <h2 style={{ color: "var(--accent-gold)" }}>Our Vision</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            To become a leading smart campus solution that integrates technology
            seamlessly into everyday campus life.
          </p>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginTop: "4rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          What We Offer
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div className="glass-panel">
            <h3>Smart Bookings</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Easily reserve halls, labs, and equipment with conflict-free
              scheduling.
            </p>
          </div>

          <div className="glass-panel">
            <h3>Maintenance Tracking</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Report and track incidents with full visibility and updates.
            </p>
          </div>

          <div className="glass-panel">
            <h3>Resource Management</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage all campus resources in one dynamic system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
