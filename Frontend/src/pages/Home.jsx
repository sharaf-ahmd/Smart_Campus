import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Top Section - Charcoal Grey */}
      <div
        style={{
          background: "var(--bg-primary)",
          textAlign: "center",
          padding: "6rem 2rem 4rem",
          position: "relative",
        }}
      >
        <h4
          style={{
            color: "var(--brand-primary)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        ></h4>
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "1.5rem",
            color: "var(--accent-gold)",
          }}
        >
          Smart Campus Operations Hub
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.2rem",
            maxWidth: "800px",
            margin: "0 auto 2.5rem",
            lineHeight: "1.6",
            fontWeight: "300",
          }}
        >
          Empower your institution with a unified platform to seamlessly manage
          facility bookings, dynamic asset catalogues, and maintenance incident
          tracking—designed for clarity, security, and scale.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/bookings">
            <button
              className="btn btn-primary"
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Explore Bookings
            </button>
          </Link>
          <Link to="/tickets">
            <button
              className="btn btn-secondary"
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              Report Incident
            </button>
          </Link>
        </div>
      </div>

      {/* SVG Wave Divider */}
      <div
        className="wave-divider"
        style={{ background: "var(--bg-tertiary)" }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            fill="var(--bg-primary)"
          />
        </svg>
      </div>

      {/* Bottom Section - Teal Accent */}
      <div
        style={{
          background: "var(--bg-tertiary)",
          padding: "4rem 2rem 8rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "var(--text-primary)",
            marginBottom: "3rem",
          }}
        >
          Platform Capabilities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            maxWidth: "1600px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <div
            className="glass-panel"
            style={{ background: "rgba(33, 37, 41, 0.4)", border: "none" }}
          >
            <div
              style={{
                color: "var(--accent-gold)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              01. Resource Directory
            </div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              Live Catalogue
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Maintain a dynamic directory of halls, labs, and equipment with
              real-time availability and technical specifications.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{ background: "rgba(33, 37, 41, 0.4)", border: "none" }}
          >
            <div
              style={{
                color: "var(--accent-gold)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              02. Smart Scheduling
            </div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              Booking System
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Reserve facilities confidently with our intelligent conflict
              prevention engine and streamlined approval workflows.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{ background: "rgba(33, 37, 41, 0.4)", border: "none" }}
          >
            <div
              style={{
                color: "var(--accent-gold)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              03. Incident Resolution
            </div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              Maintenance Hub
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Report faults with photo evidence. Track maintenance progress
              transparently from assignment to complete resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
