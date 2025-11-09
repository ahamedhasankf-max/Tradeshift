import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const roles = ["User", "Admin"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "User",
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone)) {
      errs.phone = "Phone must be 10 digits.";
    }
    if (form.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.role) errs.role = "Role is required.";
    return errs;
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: undefined }));
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    const raw = localStorage.getItem("tradeshift_users");
    let users = [];
    try {
      users = raw ? JSON.parse(raw) : [];
    } catch (err) {
      users = [];
    }
    // Prevent duplicate email
    const existing = users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
    if (existing) {
      setMsg("An account with this email already exists. Please login or use a different email.");
      return;
    }
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phone: form.phone,
      role: form.role,
    };

    users.push(newUser);
    localStorage.setItem("tradeshift_users", JSON.stringify(users));

    setMsg("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create your account</h2>
        <p className="text-sm text-gray-500 mb-6">Join TradeShift — enter details below.</p>

        {msg && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.name ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1"> Confirm Password</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          errors.confirmPassword ? "border-red-400" : "border-gray-200"
                        }`}
                        placeholder="At least 6 characters"
                      />
                      {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.phone ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="10 digit phone number"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.role ? "border-red-400" : "border-gray-200"
              }`}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
