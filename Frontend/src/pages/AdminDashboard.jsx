import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart3,
  Users,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCog,
  Wrench,
  XCircle,
  X,
  Image,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const PRIORITY_COLOR = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#10b981" };
const PRIORITY_ICON = {
  HIGH: <ArrowUpCircle size={13} />,
  MEDIUM: <ArrowRightCircle size={13} />,
  LOW: <ArrowDownCircle size={13} />,
};
const STATUS_COLOR = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  CANCELLED: "#64748b",
  OPEN: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
  CLOSED: "#64748b",
};

const StatusBadge = ({ status }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: "0.75rem",
      fontWeight: 700,
      color: STATUS_COLOR[status] || "#94a3b8",
      background: `${STATUS_COLOR[status] || "#94a3b8"}22`,
      padding: "3px 10px",
      borderRadius: 20,
    }}
  >
    {status?.replace(/_/g, " ")}
  </span>
);

/* ─── Lightbox ────────────────────────────────────────────────── */
const Lightbox = ({ url, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={url}
      alt="attachment"
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        borderRadius: 12,
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}
      onClick={(e) => e.stopPropagation()}
    />
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 20,
        right: 28,
        background: "rgba(255,255,255,0.1)",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1.25rem",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ✕
    </button>
  </div>
);

/* ─── Ticket Detail Modal ─────────────────────────────────────── */
const TicketModal = ({ ticket, onClose, onStatusChange }) => {
  const [lightbox, setLightbox] = useState(null);
  const [working, setWorking] = useState(false);
  const photos = ticket.attachments || [];

  const action = async (status) => {
    setWorking(true);
    try {
      await api.patch(`/tickets/${ticket.id}/status?status=${status}`);
      onStatusChange(ticket.id, status);
      onClose();
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setWorking(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "modalIn 0.2s ease",
        }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }`}</style>

        {/* Priority accent */}
        <div
          style={{
            height: 4,
            background: PRIORITY_COLOR[ticket.priority] || "#64748b",
            borderRadius: "18px 18px 0 0",
          }}
        />

        <div style={{ padding: "1.5rem" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  Ticket #{ticket.id}
                </span>
                <StatusBadge status={ticket.status} />
              </div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", lineHeight: 1.4 }}>
                {ticket.description}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Meta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            {[
              { label: "Reporter", value: ticket.reporter?.name || "—" },
              { label: "Resource", value: ticket.resource?.name || "—" },
              {
                label: "Category",
                value: ticket.category?.replace(/_/g, " ") || "—",
              },
              { label: "Submitted", value: fmt(ticket.createdAt) },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.72rem",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Priority */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: PRIORITY_COLOR[ticket.priority],
                background: `${PRIORITY_COLOR[ticket.priority]}22`,
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              {PRIORITY_ICON[ticket.priority]} {ticket.priority} PRIORITY
            </span>
          </div>

          {/* Photos */}
          {photos.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Image size={14} /> {photos.length} Attachment
                {photos.length > 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {photos.map((att, i) => (
                  <img
                    key={att.id ?? i}
                    src={`http://localhost:8080${att.fileUrl}`}
                    alt={`attachment-${i + 1}`}
                    onClick={() =>
                      setLightbox(`http://localhost:8080${att.fileUrl}`)
                    }
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "zoom-in",
                      transition: "transform 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS") && (
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {ticket.status === "OPEN" && (
                <button
                  disabled={working}
                  onClick={() => action("IN_PROGRESS")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: "rgba(245,158,11,0.15)",
                    color: "#f59e0b",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  <RefreshCw size={15} /> Mark In Progress
                </button>
              )}
              <button
                disabled={working}
                onClick={() => action("RESOLVED")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  fontFamily: "var(--font-family)",
                }}
              >
                <CheckCircle2 size={15} /> Mark Resolved
              </button>
              <button
                disabled={working}
                onClick={() => action("REJECTED")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: "rgba(239,68,68,0.12)",
                  color: "#ef4444",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  fontFamily: "var(--font-family)",
                }}
              >
                <XCircle size={15} /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
      {lightbox && (
        <Lightbox url={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
};

/* ─── Admin Dashboard ─────────────────────────────────────────── */
const AdminDashboard = () => {
  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/bookings/${id}`);

      // remove from UI immediately
      setAllBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };
  const [allBookings, setAllBookings] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [bRes, tRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/tickets"),
        ]);
        setAllBookings(bRes.data);
        setAllTickets(tRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pendingBookings = allBookings.filter((b) => b.status === "PENDING");
  const openTickets = allTickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  );
  const highPriorityTickets = allTickets.filter(
    (t) =>
      t.priority === "HIGH" && t.status !== "RESOLVED" && t.status !== "CLOSED",
  );

  const stats = [
    {
      label: "Total Bookings",
      value: String(allBookings.length),
      icon: <BarChart3 size={22} />,
      color: "#6366f1",
    },
    {
      label: "Total Tickets",
      value: String(allTickets.length),
      icon: <Users size={22} />,
      color: "#10b981",
    },
    {
      label: "Pending Approvals",
      value: String(pendingBookings.length),
      icon: <CalendarCheck size={22} />,
      color: "#f59e0b",
    },
    {
      label: "Open Tickets",
      value: String(openTickets.length),
      icon: <AlertTriangle size={22} />,
      color: "#ef4444",
    },
  ];

  const handleBookingAction = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status?status=${status}`);
      setAllBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleTicketStatusChange = (id, status) => {
    setAllTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  };

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
            background: "linear-gradient(135deg, #10b981, #059669)",
            padding: 14,
            borderRadius: 14,
            color: "#fff",
          }}
        >
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Campus-wide operations, approvals, and analytics.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((s, i) => (
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
                  fontSize: "0.75rem",
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

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Bar chart */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: "1rem" }}>Weekly Booking Trends</h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 140,
            }}
          >
            {[35, 50, 42, 65, 55, 70, 38].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h * 2}px`,
                    background:
                      "linear-gradient(180deg,rgba(99,102,241,0.85),rgba(99,102,241,0.2))",
                    borderRadius: "6px 6px 0 0",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket distribution */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: "1rem" }}>Tickets by Category</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[
              { label: "HARDWARE", color: "#ef4444" },
              { label: "NETWORK", color: "#f59e0b" },
              { label: "FACILITIES", color: "#6366f1" },
              { label: "SOFTWARE", color: "#10b981" },
              { label: "OTHER", color: "#94a3b8" },
            ].map((cat) => {
              const count = allTickets.filter(
                (t) => t.category === cat.label,
              ).length;
              const max = Math.max(
                ...[
                  "HARDWARE",
                  "NETWORK",
                  "FACILITIES",
                  "SOFTWARE",
                  "OTHER",
                ].map((l) => allTickets.filter((t) => t.category === l).length),
                1,
              );
              return (
                <div
                  key={cat.label}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      width: 90,
                      textAlign: "right",
                    }}
                  >
                    {cat.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(count / max) * 100}%`,
                        height: "100%",
                        background: cat.color,
                        borderRadius: 4,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: cat.color,
                      minWidth: 18,
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking approval queue */}
      <div
        className="glass-panel"
        style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <UserCog size={20} style={{ color: "#f59e0b" }} />
          <h3 style={{ margin: 0 }}>Booking Approval Queue</h3>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#f59e0b",
              background: "rgba(245,158,11,0.15)",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {pendingBookings.length} pending
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.03)",
                  textAlign: "left",
                }}
              >
                {[
                  "#",
                  "User",
                  "Resource",
                  "Purpose",
                  "Time",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 16px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                allBookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td
                      style={{
                        padding: "11px 16px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {b.id}
                    </td>
                    <td style={{ padding: "11px 16px", fontWeight: 500 }}>
                      {b.user?.name || "—"}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {b.resource?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {b.purpose || "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        whiteSpace: "nowrap",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {fmt(b.startTime)}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <StatusBadge status={b.status} />
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {b.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleBookingAction(b.id, "APPROVED")
                              }
                              style={{
                                background: "rgba(16,185,129,0.15)",
                                border: "none",
                                color: "#10b981",
                                cursor: "pointer",
                                borderRadius: 7,
                                padding: "6px 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontWeight: 600,
                                fontSize: "0.78rem",
                              }}
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>

                            <button
                              onClick={() =>
                                handleBookingAction(b.id, "REJECTED")
                              }
                              style={{
                                background: "rgba(239,68,68,0.12)",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                borderRadius: 7,
                                padding: "6px 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontWeight: 600,
                                fontSize: "0.78rem",
                              }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}

                        {/* ✅ DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          style={{
                            background: "rgba(220,38,38,0.15)",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            borderRadius: 7,
                            padding: "6px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 600,
                            fontSize: "0.78rem",
                          }}
                        >
                          <X size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets table */}
      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Wrench size={20} style={{ color: "#ef4444" }} />
          <h3 style={{ margin: 0 }}>All Tickets — Management View</h3>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#ef4444",
              background: "rgba(239,68,68,0.12)",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {highPriorityTickets.length} high priority
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.03)",
                  textAlign: "left",
                }}
              >
                {[
                  "#",
                  "Reporter",
                  "Description",
                  "Category",
                  "Priority",
                  "Photos",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 16px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No tickets found.
                  </td>
                </tr>
              ) : (
                allTickets.map((t) => {
                  const photoCount = t.attachments?.length || 0;
                  return (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td
                        style={{
                          padding: "11px 16px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {t.id}
                      </td>
                      <td style={{ padding: "11px 16px", fontWeight: 500 }}>
                        {t.reporter?.name || "—"}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          maxWidth: 240,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "var(--text-secondary)",
                        }}
                        title={t.description}
                      >
                        {t.description}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {t.category?.replace(/_/g, " ")}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: PRIORITY_COLOR[t.priority],
                            fontWeight: 700,
                            fontSize: "0.78rem",
                          }}
                        >
                          {PRIORITY_ICON[t.priority]} {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {photoCount > 0 ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#818cf8",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            <Image size={14} /> {photoCount}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.2)",
                              fontSize: "0.8rem",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <button
                          onClick={() => setSelectedTicket(t)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: "rgba(99,102,241,0.12)",
                            border: "none",
                            color: "#818cf8",
                            borderRadius: 7,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.78rem",
                            fontFamily: "var(--font-family)",
                          }}
                        >
                          View <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket detail modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleTicketStatusChange}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
