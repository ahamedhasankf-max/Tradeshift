import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    {/* Redirect root to login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Public route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/portfolio"
                        element={
                            <ProtectedRoute>
                                <PortfolioPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}
