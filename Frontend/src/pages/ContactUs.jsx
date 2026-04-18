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
          <label>Message</label>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%" }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
