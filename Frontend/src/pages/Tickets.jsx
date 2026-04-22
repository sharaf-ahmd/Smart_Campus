import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  AlertTriangle,
  Plus,
  X,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ImagePlus,
  Trash2,
} from "lucide-react";

/* ─── maps ────────────────────────────────────────────────────── */
const PRIORITY_MAP = {
  HIGH: { color: "#ef4444", icon: <ArrowUpCircle size={14} /> },
  MEDIUM: { color: "#f59e0b", icon: <ArrowRightCircle size={14} /> },
  LOW: { color: "#10b981", icon: <ArrowDownCircle size={14} /> },
};
const STATUS_MAP = {
  OPEN: { color: "#6366f1", icon: <Clock size={14} /> },
  IN_PROGRESS: { color: "#f59e0b", icon: <RefreshCw size={14} /> },
  RESOLVED: { color: "#10b981", icon: <CheckCircle2 size={14} /> },
  CLOSED: { color: "#64748b", icon: <CheckCircle2 size={14} /> },
  REJECTED: { color: "#ef4444", icon: <XCircle size={14} /> },
};

/* ─── Badge ────────────────────────────────────────────────────── */
const Badge = ({ map, value }) => {
  const st = map[value] || { color: "#94a3b8", icon: null };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: st.color,
        background: `${st.color}22`,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: "0.82rem",
        fontWeight: 600,
      }}
    >
      {st.icon}
      {value?.replace(/_/g, " ")}
    </span>
  );
};

/* ─── Photo lightbox ───────────────────────────────────────────── */
const Lightbox = ({ url, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      zIndex: 9999,
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
        boxShadow: "0 0 60px rgba(0,0,0,0.8)",
      }}
      onClick={(e) => e.stopPropagation()}
    />
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 20,
        right: 24,
        background: "none",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1.5rem",
      }}
    >
      ✕
    </button>
  </div>
);

/* ─── TicketCard ───────────────────────────────────────────────── */
const TicketCard = ({ ticket, onDelete }) => {
  const pri = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.LOW;
  const [lightbox, setLightbox] = useState(null);
  const photos = ticket.attachments || [];

  return (
    <div
      className="glass-panel"
      style={{ position: "relative", overflow: "hidden", padding: "1.5rem" }}
    >
      {/* Priority bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: pri.color,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          #{ticket.id}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge map={STATUS_MAP} value={ticket.status} />
          <button
            onClick={() => onDelete && onDelete(ticket.id)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
            title="Withdraw"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <p
        style={{
          margin: "0.5rem 0 1rem",
          lineHeight: 1.5,
          color: "var(--text-primary)",
        }}
      >
        {ticket.description}
      </p>

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: "1rem",
          }}
        >
          {photos.map((att, i) => (
            <img
              key={att.id ?? i}
              src={`http://localhost:8080${att.fileUrl}`}
              alt={`attachment-${i + 1}`}
              onClick={() => setLightbox(`http://localhost:8080${att.fileUrl}`)}
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid var(--glass-border)",
                cursor: "zoom-in",
                transition: "transform 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          borderTop: "1px solid var(--glass-border)",
          paddingTop: "0.75rem",
        }}
      >
        <Badge map={PRIORITY_MAP} value={ticket.priority} />
        <span
          style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <AlertTriangle size={14} />
          {ticket.category?.replace(/_/g, " ")}
        </span>
        <span
          style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            marginLeft: "auto",
          }}
        >
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleDateString()
            : ""}
        </span>
      </div>

      {lightbox && (
        <Lightbox url={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
};

/* ─── Main page ────────────────────────────────────────────────── */
const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    resourceId: "",
    category: "",
    priority: "MEDIUM",
    description: "",
  });
  const [photos, setPhotos] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // Object URLs
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  /* fetch */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, rRes] = await Promise.all([
        api.get("/tickets"),
        api.get("/resources"),
      ]);
      setTickets(tRes.data);
      setResources(rRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
      if (err.response) {
        setError(
          `Backend error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`,
        );
      } else if (err.request) {
        setError(
          "Could not reach backend — is the server running on port 8080?",
        );
      } else {
        setError("Unexpected error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* photo picker */
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // max 5 photos total
    const merged = [...photos, ...files].slice(0, 5);
    setPhotos(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (idx) => {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Step 1 — create ticket
      const res = await api.post("/tickets/reporter/1", {
        resourceId: Number(form.resourceId),
        category: form.category,
        priority: form.priority,
        description: form.description,
      });
      const ticketId = res.data.id;

      // Step 2 — upload photos (if any)
      if (photos.length > 0) {
        const fd = new FormData();
        photos.forEach((f) => fd.append("files", f));
        await api.post(`/tickets/${ticketId}/attachments`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // reset
      setShowForm(false);
      setForm({
        resourceId: "",
        category: "",
        priority: "MEDIUM",
        description: "",
      });
      setPhotos([]);
      setPreviews([]);
      fetchAll();
    } catch (err) {
      alert(
        "Ticket creation failed: " +
        (err.response?.data?.message || err.message),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(
        "Failed to delete ticket: " +
        (err.response?.data?.message || err.message),
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setPhotos([]);
    setPreviews([]);
    setForm({
      resourceId: "",
      category: "",
      priority: "MEDIUM",
      description: "",
    });
  };

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              padding: 12,
              borderRadius: 12,
              color: "#fff",
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Incident Tickets</h1>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Report and track campus issues.
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
        >
          {showForm ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Report Issue
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid var(--status-warning)",
            color: "var(--status-warning)",
            padding: "1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel"
          style={{
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ margin: 0 }}>Report a New Incident</h3>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Affected Resource
            </label>
            <select
              required
              value={form.resourceId}
              onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
            >
              <option value="">Select resource…</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Category
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category…</option>
              {["HARDWARE", "SOFTWARE", "NETWORK", "FACILITIES", "OTHER"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Priority
            </label>
            <select
              required
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {["LOW", "MEDIUM", "HIGH"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue in detail…"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* ── Photo upload ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Photos{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                (optional · up to 5 images)
              </span>
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                {previews.map((src, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      style={{
                        width: 88,
                        height: 88,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid var(--glass-border)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#ef4444",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone / picker */}
            {photos.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--glass-border)",
                  borderRadius: 10,
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <ImagePlus
                  size={22}
                  style={{ color: "#6366f1", flexShrink: 0 }}
                />
                <span>
                  Click to add photos{" "}
                  <span style={{ opacity: 0.6 }}>
                    ({photos.length}/5 selected)
                  </span>
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </div>
        </form>
      )}

      {/* Cards */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                height: 180,
                animation: "pulse 1.5s infinite alternate",
              }}
            >
              <style>{`@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 0.8; } }`}</style>
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-secondary)",
          }}
        >
          No tickets found. Everything is running smoothly! 🎉
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {tickets.map((t) => (
            <TicketCard key={t.id} ticket={t} onDelete={handleDeleteTicket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;
