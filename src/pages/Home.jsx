import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col justify-center items-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">
          Welcome to TradeShift
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Manage portfolios and track your financial insights with ease.
          TradeShift empowers both <span className="font-semibold">Users</span> and <span className="font-semibold">Admins </span>
          to collaborate and monitor investment performance efficiently.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
    );
}