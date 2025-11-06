<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Registration from './components/Registration';

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

                    
        <Route path="/register" element={<Registration />} />
        {/* Your other routes */}
      
                </Routes>
            </div>
        </Router>
    );
=======
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Portfolio from "./pages/Portfolio.jsx";

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TradeShift
        </Link>

        {!user ? (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {user.role === "Admin" ? (
              <Link
                to="/portfolio"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Portfolio
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
            )}
            <span className="text-gray-500 text-sm">
              Welcome, <span className="font-semibold">{user.role}</span>
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("tradeshift_currentUser");
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tradeshift_currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
      <footer className="bg-gray-100 py-3 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TradeShift. All rights reserved.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
>>>>>>> 459aa72 (Updated Register page and added home page)
}
