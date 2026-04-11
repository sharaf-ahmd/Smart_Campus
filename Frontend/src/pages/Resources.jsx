import React, { useEffect, useState } from "react";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import { Layers, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "ROOM",
    location: "",
    capacity: 0,
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    try {
      const response = await api.get("/resources");
      setResources(response.data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
      setError("Failed to connect to the backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleEdit = (r) => {
    setForm({
      name: r.name,
      type: r.type,
      location: r.location,
      capacity: r.capacity,
      status: r.status,
    });
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, form);
      } else {
        await api.post("/resources", form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm({
        name: "",
        type: "ROOM",
        location: "",
        capacity: 0,
        status: "ACTIVE",
      });
      fetchResources();
    } catch (err) {
      alert(
        "Failed to save resource: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem 0" }}>
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
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--brand-hover))",
            padding: "12px",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <Layers size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>
            Facilities & Resources
          </h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            View and manage campus physical assets.
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({
                name: "",
                type: "ROOM",
                location: "",
                capacity: 0,
                status: "ACTIVE",
              });
            }}
          >
            {showForm ? (
              <>
                <X size={18} /> Cancel
              </>
            ) : (
              <>
                <Plus size={18} /> Add Resource
              </>
            )}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
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
            <h3 style={{ margin: 0 }}>
              {editingId ? "Edit Resource" : "Add New Resource"}
            </h3>
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
              Name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
              }}
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
              Type
            </label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)",
                color: "grey",
              }}
            >
              {["ROOM", "LAB", "EQUIPMENT"].map((t) => (
                <option key={t} value={t}>
                  {t}
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
              Location
            </label>
            <input
              required
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
              }}
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
              Capacity
            </label>
            <input
              required
              type="number"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
              }}
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
              Status
            </label>
            <select
              required
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)",
                color: "grey",
              }}
            >
              {["ACTIVE", "OUT_OF_SERVICE"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
              {submitting ? "Saving..." : "Save Resource"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid var(--status-warning)",
            color: "var(--status-warning)",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                height: "160px",
                animation: "pulse 1.5s infinite alternate",
              }}
            >
              <style>{`@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 0.8; } }`}</style>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
