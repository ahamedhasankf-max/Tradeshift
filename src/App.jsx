import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Register from './pages/Register.jsx';
import Home from "./pages/Home.jsx";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
          {/* Redirect root to login */}
                              <Route path="/" element={<Home />} />

                              {/* Public route */}
                              <Route path="/login" element={<Login />} />

                              {/* Protected routes */}
                              <Route
                                  path="/dashboard"
                                  element={
                                      <ProtectedRoute>
                                          <Dashboard />
                                      </ProtectedRoute>
                                  }
                              />
                              <Route
                                  path="/portfolio"
                                  element={
                                      <ProtectedRoute>
                                          <Portfolio />
                                      </ProtectedRoute>
                                  }
                              />

                              {/* Catch-all fallback */}
                              <Route path="*" element={<Navigate to="/login" />} />


                  <Route path="/register" element={<Register />} />
                  {/* Your other routes */}
                </Routes>
            </div>
        </Router>
    );
}