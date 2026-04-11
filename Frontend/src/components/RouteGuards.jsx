import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
 ProtectedRoute — Requires authentication.
 Redirects unauthenticated visitors to /login.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Verifying authentication…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/*
AdminRoute — Requires ADMIN role.
If not authenticated → /login.
If authenticated but not ADMIN → /unauthorized.
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Verifying access…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/*
 UserRoute — Requires USER role.
 If not authenticated → /login.
 If authenticated but not USER (e.g. ADMIN) → /unauthorized.
 */
export const UserRoute = ({ children }) => {
  const { isAuthenticated, isUser, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Verifying access…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
