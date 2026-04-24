import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  ChevronRight,
  Image,
  X
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
  OPEN: "#6366f1",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
  CLOSED: "#64748b",
  REJECTED: "#ef4444",
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
const TicketModal = ({ ticket, onClose, onRefresh }) => {
  const [working, setWorking] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const photos = ticket.attachments || [];

  const updateStatus = async (status) => {
    setWorking(true);
    try {
      await api.patch(`/tickets/${ticket.id}/status?status=${status}`);
      onRefresh();
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
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusBadge status={ticket.status} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Ticket #{ticket.id}</span>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>

          <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.25rem", lineHeight: 1.4 }}>{ticket.description}</h2>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Reporter", value: ticket.reporter?.name || "—" },
              { label: "Resource", value: ticket.resource?.name || "—" },
              { label: "Category", value: ticket.category?.replace(/_/g, " ") || "—" },
              { label: "Submitted", value: fmt(ticket.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ margin: "0 0 2px", fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Priority */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: PRIORITY_COLOR[ticket.priority],
              background: `${PRIORITY_COLOR[ticket.priority]}22`,
              padding: "5px 14px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 700
            }}>
              {PRIORITY_ICON[ticket.priority]} {ticket.priority} PRIORITY
            </span>
          </div>

          {/* Photos */}
          {photos.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ margin: "0 0 10px", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <Image size={14} /> {photos.length} Attachment{photos.length > 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {photos.map((att, i) => (
                  <img
                    key={att.id ?? i}
                    src={`http://localhost:8080${att.fileUrl}`}
                    alt={`attachment-${i + 1}`}
                    onClick={() => setLightbox(`http://localhost:8080${att.fileUrl}`)}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", cursor: "zoom-in" }}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
            {ticket.status === "IN_PROGRESS" && (
              <button
                disabled={working}
                onClick={() => updateStatus("RESOLVED")}
                style={{
                  flex: 1, padding: "12px", borderRadius: 8, border: "none",
                  background: "#10b981", color: "#fff", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
              >
                <CheckCircle2 size={18} /> Mark as Resolved
              </button>
            )}
            {ticket.status === "OPEN" && (
                <button
                disabled={working}
                onClick={() => updateStatus("IN_PROGRESS")}
                style={{
                  flex: 1, padding: "12px", borderRadius: 8, border: "none",
                  background: "#f59e0b", color: "#fff", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
              >
                <Clock size={18} /> Accept & Start Working
              </button>
            )}
          </div>
        </div>
      </div>
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
};

/* ─── Technician Dashboard ─────────────────────────────────────── */
const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/tickets/assignee/${user.id}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchTickets();
  }, [user?.id]);

  const stats = [
    { label: "Assigned To Me", value: String(tickets.length), icon: <Wrench size={20} />, color: "#6366f1" },
    { label: "In Progress", value: String(tickets.filter(t => t.status === "IN_PROGRESS").length), icon: <Clock size={20} />, color: "#f59e0b" },
    { label: "Resolved", value: String(tickets.filter(t => t.status === "RESOLVED").length), icon: <CheckCircle2 size={20} />, color: "#10b981" },
  ];

  return (
    <div style={{ padding: "2rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: 14, borderRadius: 14, color: "#fff" }}>
          <Wrench size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Technician Portal</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>Manage and resolve assigned maintenance tasks.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
            <div style={{ background: `${s.color}22`, color: s.color, padding: 12, borderRadius: 12 }}>{s.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>{s.label}</p>
              <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#fff" }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ margin: 0 }}>Assigned Tickets</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", textAlign: "left" }}>
                {["#", "Reporter", "Resource", "Category", "Priority", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>No tickets assigned to you.</td></tr>
              ) : (
                tickets.map(t => (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{t.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{t.reporter?.name}</td>
                    <td style={{ padding: "12px 16px" }}>{t.resource?.name || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>{t.category?.replace(/_/g, " ")}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: PRIORITY_COLOR[t.priority], fontWeight: 700 }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        style={{ background: "rgba(99,102,241,0.12)", border: "none", color: "#818cf8", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRefresh={fetchTickets}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;
