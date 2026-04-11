import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true); // true while checking stored token
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Fetch the current user profile from /api/auth/me
  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data); // { id, name, email, role }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      // Token is invalid or expired — clear it
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /*
   Called after a successful Google OAuth login.
   Receives the credential (JWT id_token from Google).
   Stores it and fetches the user profile.
   */
  const login = async (googleCredential) => {
    localStorage.setItem("token", googleCredential);
    setToken(googleCredential);
    // fetchUser will trigger via the useEffect
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
