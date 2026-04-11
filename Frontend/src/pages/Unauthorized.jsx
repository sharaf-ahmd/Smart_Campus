import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldOff } from "lucide-react";

const Unauthorized = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const dashboardLink = isAdmin ? "/admin/dashboard" : "/user/dashboard";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "2rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          padding: "3rem 2.5rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            width: 80,
            height: 80,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
          }}
        >
          <ShieldOff size={40} color="#fff" />
        </div>

        <h1
          style={{ margin: "0 0 0.5rem", fontSize: "2.5rem", color: "#ef4444" }}
        >
          403
        </h1>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.5rem" }}>
          Access Denied
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          You do not have the required permissions to access this page. Your
          current role does not allow access to this section of the platform.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {isAuthenticated ? (
            <Link to={dashboardLink}>
              <button className="btn btn-primary">Go to My Dashboard</button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">Go to Login</button>
            </Link>
          )}
          <Link to="/">
            <button className="btn btn-secondary">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
