import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserPanel from "./pages/UserPanel";
import DoctorPanel from "./pages/DoctorPanel";
import ProtectedRoute from "./ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Faqs from "./pages/Faqs";
import Privacy from "./pages/Privacy";
import UserChat from "./components/UserChat";
import DoctorChat from "./components/DoctorChat";

// Layout with Navbar + Footer
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

// Layout without Navbar + Footer
function PanelLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
}

function App() {
  // Use state to track authentication status
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    () => !!localStorage.getItem("userAuthToken")
  );
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(
    () => !!localStorage.getItem("doctorAuthToken")
  );

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsUserLoggedIn(!!localStorage.getItem("userAuthToken"));
      setIsDoctorLoggedIn(!!localStorage.getItem("doctorAuthToken"));
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* Routes with Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Routes without Navbar + Footer */}
      <Route element={<PanelLayout />}>
        <Route
          path="/user"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <UserPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute isLoggedIn={isDoctorLoggedIn}>
              <DoctorPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/chat/:doctorId/:patientId"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <UserChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/chat/:doctorId/:patientId"
          element={
            <ProtectedRoute isLoggedIn={isDoctorLoggedIn}>
              <DoctorChat />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
