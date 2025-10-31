import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const portfolioValue = 125000; // Mock data
    const profitLoss = 3200; // Mock data

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-gray-600">Portfolio Value</h2>
                    <p className="text-2xl font-bold text-indigo-600">${portfolioValue}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-gray-600">Profit / Loss</h2>
                    <p
                        className={`text-2xl font-bold ${
                            profitLoss >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {profitLoss >= 0 ? "+" : ""}
                        {profitLoss}
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-gray-600">Quick Links</h2>
                    <Link
                        to="/portfolio"
                        className="inline-block mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Go to Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
