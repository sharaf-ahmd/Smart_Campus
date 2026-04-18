import React, { useState } from "react";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", color: "var(--accent-gold)" }}>
          Contact Us
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Have questions or need support? Reach out to us.
        </p>
      </div>

      {/* Form */}
      <form className="glass-panel" onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        
      </form>
    </div>
  );
};

export default ContactUs;
