import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // SUCCESS: Save real JWT token
      localStorage.setItem("jwtToken", data.jwtToken);
      localStorage.setItem("currentUser", JSON.stringify({
        email: data.username,
        // you can add name, id later if you extend the response
      }));

      console.log("Login successful! Token saved.");

      // Redirect, redirect based on role or just go to portfolio
      navigate("/portfolio");

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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
          <p className="text-red-500 text-sm text-center mb-3 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-indigo-600 focus:border-indigo-600"
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
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-indigo-600 focus:border-indigo-600"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}