import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const handleChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
        setError("");
      };

    const handleLogin = (e) => {
        e.preventDefault();
        const raw = localStorage.getItem("tradeshift_users");
            let users = [];
            try {
              users = raw ? JSON.parse(raw) : [];
            } catch (err) {
              users = [];
            }

        const user = users.find(
              (u) =>
                u.email.toLowerCase() === form.email.toLowerCase() &&
                u.password === form.password
            );
        if (!user) {
              setError("Invalid email or password.");
              return;
            }
        localStorage.setItem("tradeshift_currentUser", JSON.stringify(user));
        if (user.role === "Admin") {
              navigate("/portfolio");
            } else {
              navigate("/dashboard");
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
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md focus:outline-indigo-600"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-1 font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md focus:outline-indigo-600"
                        placeholder="Your password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Login
                </button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                                      Don’t have an account?{" "}
                                      <Link to="/register" className="text-blue-600 font-medium hover:underline">
                                        Register
                                      </Link>
                                    </p>
            </form>
        </div>
    );
}