import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const NotificationPanel = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications/user/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // refresh every 30s when panel is closed, immediately when opened
  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [open, user?.id]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;
    try {
      await api.patch(`/notifications/user/${user.id}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        style={{
          background: open ? "rgba(99,102,241,0.15)" : "transparent",
          border:
            "1px solid " +
            (open ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"),
          borderRadius: 8,
          cursor: "pointer",
          color: open ? "#818cf8" : "rgba(248,250,252,0.65)",
          padding: "6px 8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: "#ef4444",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              border: "2px solid #0f172a",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 380,
            maxHeight: 480,
            background: "rgba(15,23,42,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            zIndex: 200,
            overflow: "hidden",
            animation: "ntfSlide 0.18s ease",
          }}
        >
          <style>{`@keyframes ntfSlide { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>

          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "0.95rem", flex: 1 }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  border: "none",
                  color: "#818cf8",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", maxHeight: 400 }}>
            {loading ? (
              <p
                style={{
                  padding: 28,
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                }}
              >
                Loading…
              </p>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "36px 24px", textAlign: "center" }}>
                <Bell
                  size={32}
                  style={{ color: "rgba(255,255,255,0.15)", marginBottom: 10 }}
                />
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                  }}
                >
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "13px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: n.isRead
                      ? "transparent"
                      : "rgba(99,102,241,0.07)",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Unread dot */}
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      marginTop: 7,
                      flexShrink: 0,
                      background: n.isRead
                        ? "rgba(255,255,255,0.1)"
                        : "#6366f1",
                      boxShadow: n.isRead
                        ? "none"
                        : "0 0 6px rgba(99,102,241,0.7)",
                    }}
                  />

                  

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.3)",
                        padding: 3,
                        flexShrink: 0,
                        display: "flex",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#818cf8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                      }
                    >
                      <Check size={15} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
