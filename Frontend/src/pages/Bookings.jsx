import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  Ban,
  Plus,
  X,
  Trash2,
} from "lucide-react";

const STATUS_STYLES = {
  PENDING: { color: "#f59e0b", icon: <Hourglass size={14} /> },
  APPROVED: { color: "#10b981", icon: <CheckCircle2 size={14} /> },
  REJECTED: { color: "#ef4444", icon: <XCircle size={14} /> },
  CANCELLED: { color: "#64748b", icon: <Ban size={14} /> },
};

const BookingRow = ({ booking, onDelete, deleting }) => {
  const st = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
  const fmt = (dt) => (dt ? new Date(dt).toLocaleString() : "—");
  const canDelete = booking.status !== "APPROVED";

  return (
    <tr
      style={{
        borderBottom: "1px solid var(--glass-border)",
        opacity: deleting ? 0.5 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <td style={{ padding: "14px 16px" }}>{booking.id}</td>
      <td style={{ padding: "14px 16px" }}>
        {booking.resource?.name ?? `Resource #${booking.resourceId ?? "?"}`}
      </td>
      <td style={{ padding: "14px 16px" }}>{booking.purpose || "—"}</td>
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} />
          {fmt(booking.startTime)}
        </div>
      </td>
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} />
          {fmt(booking.endTime)}
        </div>
      </td>
      <td style={{ padding: "14px 16px" }}>
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
          {booking.status}
        </span>
      </td>
      <td style={{ padding: "14px 16px" }}>
        {canDelete ? (
          <button
            onClick={() => onDelete(booking.id)}
            disabled={deleting}
            title="Delete booking"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: deleting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!deleting)
                e.currentTarget.style.background = "rgba(239,68,68,0.25)";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
            }
          >
            <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
          </button>
        ) : (
          <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
            —
          </span>
        )}
      </td>
    </tr>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    resourceId: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/resources"),
      ]);
      setBookings(bRes.data);
      setResources(rRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this booking? This cannot be undone.",
      )
    )
      return;
    setDeletingId(id);
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // userId=1 is a placeholder; in a real app it comes from auth context
      await api.post("/bookings/user/1", {
        resourceId: Number(form.resourceId),
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
      });
      setShowForm(false);
      setForm({ resourceId: "", startTime: "", endTime: "", purpose: "" });
      fetchAll();
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
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
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              padding: 12,
              borderRadius: 12,
              color: "#fff",
            }}
          >
            <CalendarDays size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Bookings</h1>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Reserve facilities and track your bookings.
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              New Booking
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

      {/* Booking Form */}
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
            <h3 style={{ margin: 0 }}>Create a New Booking</h3>
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
              Resource
            </label>
            <select
              required
              value={form.resourceId}
              onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
            >
              <option value="">Select a resource...</option>
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
              Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Guest Lecture"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
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
              Start Time
            </label>
            <input
              type="datetime-local"
              required
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
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
              End Time
            </label>
            <input
              type="datetime-local"
              required
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
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
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Booking"}
            </button>
          </div>
        </form>
      )}

      {/* Bookings Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.04)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Resource
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Purpose
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Start
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  End
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Loading bookings…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No bookings found. Create one!
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    onDelete={handleDelete}
                    deleting={deletingId === b.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
