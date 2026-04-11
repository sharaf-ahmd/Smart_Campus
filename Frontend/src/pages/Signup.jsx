import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { UserPlus } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const profileRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const profile = await profileRes.json();

        await api.post("/auth/signup", {
          email: profile.email,
          name: profile.name,
          oauthProviderId: profile.sub,
        });

        setStatus({
          type: "success",
          message: "Account created! Redirecting…",
        });
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setStatus({
          type: "error",
          message: err.response?.data?.message || "Signup failed.",
        });
      }
    },
    onError: () =>
      setStatus({ type: "error", message: "Google authentication failed." }),
  });

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
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          padding: "3rem 2.5rem",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            background: "rgba(46,125,115,0.15)",
            border: "1px solid rgba(46,125,115,0.3)",
          }}
        >
          <UserPlus size={30} color="var(--accent-gold)" />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "1.9rem",
            marginBottom: "0.5rem",
            color: "var(--accent-gold)",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          Join the Smart Campus ecosystem and manage everything seamlessly.
        </p>

        {/* Status */}
        {status && (
          <div
            style={{
              padding: "12px",
              borderRadius: 8,
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              background:
                status.type === "success"
                  ? "rgba(56,176,0,0.1)"
                  : "rgba(217,4,41,0.1)",
              border: `1px solid ${
                status.type === "success"
                  ? "var(--status-success)"
                  : "var(--status-danger)"
              }`,
              color:
                status.type === "success"
                  ? "var(--status-success)"
                  : "var(--status-danger)",
            }}
          >
            {status.message}
          </div>
        )}

        {/* Button */}
        <button
          className="btn btn-primary"
          onClick={() => handleGoogleSignup()}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          <UserPlus size={18} />
          Sign up with Google
        </button>

        {/* Footer */}
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "var(--brand-primary)",
              fontWeight: 500,
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
