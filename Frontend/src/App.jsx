import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import {
  ProtectedRoute,
  AdminRoute,
  UserRoute,
} from "./components/RouteGuards.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

// Shared pages (require authentication, either role)
import Resources from "./pages/Resources.jsx";

// User-only pages
import UserDashboard from "./pages/UserDashboard.jsx";
import Bookings from "./pages/Bookings.jsx";
import Tickets from "./pages/Tickets.jsx";

// Admin-only pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";

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

          {/* ========== ADMIN-ONLY ROUTES ========== */}
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
