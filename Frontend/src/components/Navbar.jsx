import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPanel from "./NotificationPanel";
import {
  LogOut, LayoutDashboard, CalendarDays, AlertTriangle,
  BookOpen, ShieldCheck, Home, Wrench
} from "lucide-react";

const NAV_ICON = {
  "/resources":       <BookOpen      size={16} />,
  "/user/dashboard":  <LayoutDashboard size={16} />,
  "/bookings":        <CalendarDays  size={16} />,
  "/tickets":         <AlertTriangle size={16} />,
  "/technician/dashboard": <Wrench size={16} />,
  "/admin/dashboard": <ShieldCheck   size={16} />,
};

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { isAuthenticated, isAdmin, isTechnician, isUser, user, logout } = useAuth();

  const navLinks = [{ to: "/resources", label: "Resources" }];
  if (isUser) {
    navLinks.push(
      { to: "/user/dashboard", label: "Dashboard" },
      { to: "/bookings",       label: "Bookings"  },
      { to: "/tickets",        label: "Tickets"   },
    );
  }
  if (isTechnician) {
    navLinks.push({ to: "/technician/dashboard", label: "Task List" });
  }
  if (isAdmin) {
    navLinks.push({ to: "/admin/dashboard", label: "Admin Panel" });
  }

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(33,37,41,0.92)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 2px 28px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        maxWidth: 1600,
        margin: "0 auto",
        padding: "0 2rem",
        height: 66,                    /* was 60px — slightly taller */
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: "0.55rem",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "1.25rem",          /* was 1.4rem — heading font is naturally larger */
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}>
            <Home size={20} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
            Smart Campus Hub
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flex: 1 }}>
          {navLinks.map(link => {
            const isActive =
              location.pathname === link.to ||
              (link.to !== "/" && location.pathname.startsWith(link.to));
            return (
              <Link key={link.to} to={link.to} style={{ textDecoration: "none" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  padding: "7px 14px",
                  borderRadius: 20,
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--accent-gold)" : "var(--text-secondary)",
                  background: isActive ? "rgba(197,160,89,0.12)" : "transparent",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  {NAV_ICON[link.to]}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Right Side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>

          {isAuthenticated && <NotificationPanel />}

          {isAuthenticated ? (
            <>
              {/* User chip */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.55rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28, padding: "5px 14px 5px 8px",
              }}>
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2e7d73, #c5a059)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "var(--text-sm)", fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>

                <span style={{
                  fontSize: "var(--text-sm)", fontWeight: 600,
                  color: "var(--text-primary)", maxWidth: 140,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user?.name}
                </span>

                <span style={{
                  fontSize: "var(--text-xs)", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  background: isAdmin ? "rgba(239,68,68,0.18)" : isTechnician ? "rgba(99,102,241,0.18)" : "rgba(197,160,89,0.18)",
                  color: isAdmin ? "#f87171" : isTechnician ? "#818cf8" : "var(--accent-gold)",
                  padding: "3px 9px", borderRadius: 10,
                }}>
                  {user?.role}
                </span>
              </div>

              {/* Logout */}
              <button onClick={handleLogout} style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "rgba(248,250,252,0.6)",
                fontSize: "var(--text-sm)", fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s ease",
                fontFamily: "var(--font-family)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(248,250,252,0.6)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "7px 20px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: "rgba(248,250,252,0.85)",
                  fontSize: "var(--text-sm)", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s ease",
                  fontFamily: "var(--font-family)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  Login
                </button>
              </Link>

              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "7px 20px", borderRadius: 8, border: "none",
                  background: "var(--brand-primary)",
                  color: "#fff",
                  fontSize: "var(--text-sm)", fontWeight: 700,
                  cursor: "pointer", boxShadow: "0 2px 10px rgba(46,125,115,0.4)",
                  transition: "all 0.15s ease", fontFamily: "var(--font-family)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--brand-hover)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,125,115,0.55)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--brand-primary)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(46,125,115,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
