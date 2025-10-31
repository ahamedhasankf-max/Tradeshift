import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // Simple demo credentials
        const validEmail = "admin@tradeshift.com";
        const validPassword = "123456";

        if (email === validEmail && password === validPassword) {
            // Save mock token
            localStorage.setItem("token", "mock-jwt-token");
            navigate("/dashboard");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center h-[80vh] bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
                    TradeShift Login
                </h2>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-3">{error}</p>
                )}

                <div className="mb-4">
                    <label className="block text-sm mb-1 font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-indigo-600"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-1 font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:outline-indigo-600"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
