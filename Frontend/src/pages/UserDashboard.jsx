import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  User,
  CalendarDays,
  AlertTriangle,
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  ArrowRight,
  BookOpen,
  X,
} from "lucide-react";

const STATUS_COLORS = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  CANCELLED: "#64748b",
  OPEN: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
  CLOSED: "#64748b",
};

const Badge = ({ status }) => {
  const color = STATUS_COLORS[status] || "#94a3b8";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: "0.78rem",
        fontWeight: 600,
        color,
        background: `${color}22`,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
};

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, tRes] = await Promise.all([
          api.get("/bookings/user/1"),
          api.get("/tickets/reporter/1"),
        ]);
        setBookings(bRes.data);
        setTickets(tRes.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };

  const fmt = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
  const activeBookings = bookings.filter(
    (b) => b.status === "APPROVED" || b.status === "PENDING",
  ).length;
  const openTickets = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  ).length;

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            padding: 14,
            borderRadius: 14,
            color: "#fff",
          }}
        >
          <User size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>My Dashboard</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Your personal campus activity at a glance.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Active Bookings",
            value: activeBookings,
            icon: <CalendarDays size={22} />,
            color: "#6366f1",
          },
          {
            label: "Open Tickets",
            value: openTickets,
            icon: <AlertTriangle size={22} />,
            color: "#ef4444",
          },
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: <BookOpen size={22} />,
            color: "#10b981",
          },
          {
            label: "Total Tickets",
            value: tickets.length,
            icon: <Bell size={22} />,
            color: "#f59e0b",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                background: `${s.color}22`,
                color: s.color,
                padding: 12,
                borderRadius: 12,
              }}
            >
              {s.icon}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {s.label}
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {s.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link to="/bookings">
          <button className="btn btn-primary">
            <Plus size={18} />
            New Booking
          </button>
        </Link>
        <Link to="/tickets">
          <button className="btn btn-secondary">
            <AlertTriangle size={18} />
            Report Issue
          </button>
        </Link>
        <Link to="/resources">
          <button className="btn btn-secondary">
            <BookOpen size={18} />
            Browse Resources
          </button>
        </Link>
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* My Bookings */}
        <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem 0.75rem",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>My Upcoming Bookings</h3>
            <Link
              to="/bookings"
              style={{
                color: "var(--brand-primary)",
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              Loading…
            </p>
          ) : bookings.length === 0 ? (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              No bookings yet.
            </p>
          ) : (
            bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                style={{
                  padding: "14px 1.5rem",
                  borderTop: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ color: "var(--brand-primary)", flexShrink: 0 }}>
                  <CalendarDays size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>
                    {b.resource?.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {b.purpose} ·{" "}
                    <Clock size={12} style={{ verticalAlign: "middle" }} />{" "}
                    {fmt(b.startTime)}
                  </p>
                </div>
                <Badge status={b.status} />
              </div>
            ))
          )}
        </div>

        {/* My Tickets */}
        <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem 0.75rem",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>My Recent Tickets</h3>
            <Link
              to="/tickets"
              style={{
                color: "var(--brand-primary)",
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              Loading…
            </p>
          ) : tickets.length === 0 ? (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              No tickets filed.
            </p>
          ) : (
            tickets.slice(0, 5).map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "14px 1.5rem",
                  borderTop: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      t.priority === "HIGH"
                        ? "#ef4444"
                        : t.priority === "MEDIUM"
                          ? "#f59e0b"
                          : "#10b981",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.description}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    #{t.id} · {t.category} · {fmt(t.createdAt)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Badge status={t.status} />
                  <button
                    onClick={() => handleDeleteTicket(t.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      marginLeft: "12px",
                    }}
                    title={
                      t.status === "RESOLVED" || t.status === "CLOSED"
                        ? "Remove"
                        : "Withdraw"
                    }
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
