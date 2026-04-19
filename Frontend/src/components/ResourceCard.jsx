import React from "react";
import {
  MapPin,
  Users,
  CheckCircle,
  AlertOctagon,
  Box,
  Monitor,
  Laptop,
  Edit,
  Trash2,
} from "lucide-react";

const ResourceCard = ({ resource, isAdmin, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    return status === "ACTIVE"
      ? "var(--status-success)"
      : "var(--status-danger)";
  };

  const getIcon = (type) => {
    switch (type) {
      case "ROOM":
        return <Box size={24} />;
      case "LAB":
        return <Monitor size={24} />;
      case "EQUIPMENT":
        return <Laptop size={24} />;
      default:
        return <Box size={24} />;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          backgroundColor: getStatusColor(resource.status),
        }}
      ></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "10px",
              borderRadius: "10px",
              color: "var(--brand-primary)",
            }}
          >
            {getIcon(resource.type)}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.25rem",
                color: "var(--text-primary)",
              }}
            >
              {resource.name}
            </h3>
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {resource.type}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: getStatusColor(resource.status),
            background: "rgba(0,0,0,0.2)",
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          {resource.status === "ACTIVE" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertOctagon size={16} />
          )}
          {resource.status.replace(/_/g, " ")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
          }}
        >
          <MapPin size={16} />
          {resource.location}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
          }}
        >
          <Users size={16} />
          Capacity: {resource.capacity}
        </div>

        {isAdmin && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => onEdit(resource)}
              style={{
                background: "transparent",
                border: "none",
                color: "#f59e0b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(resource.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
