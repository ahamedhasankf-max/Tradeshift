import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleRegister = () => {
        localStorage.removeItem("token");
        navigate("/Register");
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">TradeShift</h1>
            <div className="space-x-4">
                <Link to="/">Home</Link>
                        {role === "admin" && (
                          <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/portfolio">Portfolio</Link>
                          </>
                        )}
                        {role === "user" && (
                          <>
                            <Link to="/portfolio">Portfolio</Link>
                          </>
                        )}
                <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 font-medium"
                >
                    Login
                </button>
                 <button
                    onClick={handleRegister}
                    className="text-red-500 hover:text-red-700 font-medium"
                >
                    Register
                </button>
            </div>
        </nav>
    );
}