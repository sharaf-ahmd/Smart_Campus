import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSuccess = async (credentialResponse) => {
    await login(credentialResponse.credential);
  };

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
          <Shield size={30} color="var(--accent-gold)" />
        </div>




        {/* Google Login */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.error("Login Failed")}
            theme="outline"
            size="large"
          />
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "var(--brand-primary)",
              fontWeight: 500,
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
