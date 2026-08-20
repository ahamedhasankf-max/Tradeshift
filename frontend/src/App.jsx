import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import BuyPage from "./pages/BuyPage.jsx";

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="text-4xl font-extrabold tracking-tight">TradeShift</div>

        <div className="flex items-center space-x-10 text-lg font-semibold">
          {isLoggedIn ? (
            <>
              <div className="hover:text-indigo-200 transition cursor-pointer" onClick={() => window.location.href = "/dashboard"}>
                Dashboard
              </div>
              <div 
                className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full font-bold text-xl shadow-xl transform hover:scale-110 transition cursor-pointer"
                onClick={() => window.location.href = "/buy"}
              >
                BUY STOCKS
              </div>
              <div className="hover:text-indigo-200 transition cursor-pointer" onClick={() => window.location.href = "/portfolio"}>
                Portfolio
              </div>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-xl shadow-xl transform hover:scale-110 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="hover:text-indigo-200 transition cursor-pointer" onClick={() => window.location.href = "/login"}>
                Login
              </div>
              <div 
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-xl shadow-xl transition cursor-pointer"
                onClick={() => window.location.href = "/register"}
              >
                Register
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // THIS IS THE KEY LINE — HIDES NAVBAR ON HOME
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("jwtToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
    const interval = setInterval(checkLogin, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR ONLY SHOWS IF NOT ON HOME PAGE */}
      {!isHomePage && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/buy" element={<BuyPage />} />
        </Routes>
      </main>

      {/* FOOTER ALSO HIDDEN ON HOME */}
      {!isHomePage && (
        <footer className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 text-center">
          © {new Date().getFullYear()} TradeShift. All rights reserved.
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}