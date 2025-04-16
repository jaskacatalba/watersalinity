// src/App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import FrontPageLayout from "./layouts/FrontPageLayout";
import RepLayout from "./layouts/RepLayout"; // Layout for Barangay Representatives
import Footer from "./components/Footer";

// Front-end / Viewer pages
import Blue from "./pages/Blue";
import DashboardView from "./pages/DashboardView";
import Articles from "./pages/Articles";
import Projects from "./pages/Projects";
import AboutUs from "./pages/AboutUs";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterPage from "./pages/RegisterPage";

// Admin pages
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";

// Dynamic container for municipality/barangay
import BarangayCont from "./pages/Barangay/BarangayCont";

// NEW: Import your UserCont component when ready
import UserCont from "./pages/UserCont";

import "./index.css";

function LayoutWrapper() {
  const location = useLocation();
  let layoutClass = "default-layout";
  if (location.pathname.startsWith("/viewer")) {
    layoutClass = "viewer-layout";
  }
  return (
    <div className={layoutClass}>
      <Routes>
        {/* ==================== Viewer Routes ==================== */}
        <Route path="/viewer" element={<FrontPageLayout />}>
          <Route path="blue" element={<Blue />} />
          <Route path="dashboardview" element={<DashboardView />} />
          <Route path="articles" element={<Articles />} />
          <Route path="projects" element={<Projects />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="loginpage" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* ==================== User Routes ==================== */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserCont />} />
          <Route path=":municipalityName/:barangayName" element={<BarangayCont />} />
        </Route>

        {/* ==================== Admin Routes ==================== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path=":municipalityName/:barangayName" element={<BarangayCont />} />
        </Route>

        {/* ==================== Barangay Representative Routes ==================== */}
        <Route path="/barangay" element={<RepLayout />}>
          <Route path="dashboard" element={<BarangayCont />} />
          <Route path=":municipalityName/:barangayName" element={<BarangayCont />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return <LayoutWrapper />;
}

export default App;
