import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  ProtectedRoute,
  AdminRoute,
  UserRoute,
  TechnicianRoute,
} from "./components/RouteGuards";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";

// Shared pages (require authentication, either role)
import Resources from "./pages/Resources";

// User-only pages
import UserDashboard from "./pages/UserDashboard";
import Bookings from "./pages/Bookings";
import Tickets from "./pages/Tickets";

// Admin-only pages
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app-container">
      <Navbar />
      <main className={isHome ? "home-content" : "main-content"}>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Public GET — resources can be viewed without auth */}
          <Route path="/resources" element={<Resources />} />

          {/* ========== USER-ONLY ROUTES ========== */}
          <Route
            path="/user/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <UserRoute>
                <Bookings />
              </UserRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <UserRoute>
                <Tickets />
              </UserRoute>
            }
          />

          <Route
            path="/technician/dashboard"
            element={
              <TechnicianRoute>
                <TechnicianDashboard />
              </TechnicianRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ========== CATCH-ALL ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
