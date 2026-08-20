import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "d42cug9r01qorleqp42gd42cug9r01qorleqp430";
    const symbol = "AAPL";

    async function fetchStock() {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
            );
            if (!response.ok) throw new Error("Failed to fetch stock data");
            const data = await response.json();
            setStock(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStock();
        const interval = setInterval(fetchStock, 10000);
        return () => clearInterval(interval);
    }, []);

    const portfolioValue = stock ? (stock.c * 10).toFixed(2) : 0;
    const profitLoss = stock ? (stock.c - stock.pc).toFixed(2) : 0;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Portfolio Value */}
                <div className="bg-white shadow-md rounded-xl p-6 text-center">
                    <h2 className="text-gray-600">Portfolio Value</h2>
                    <p className="text-2xl font-bold text-indigo-600">
                        ${portfolioValue}
                    </p>
                </div>

                {/* Profit / Loss */}
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

                {/* Quick Links */}
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

            {/* Stock Details */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-indigo-700 mb-3">
                    Live Stock Data ({symbol})
                </h2>
                {loading && <p>Loading stock data...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {stock && !loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-gray-500">Current Price</p>
                            <p className="text-lg font-bold">${stock.c}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">High</p>
                            <p className="text-lg font-bold">${stock.h}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Low</p>
                            <p className="text-lg font-bold">${stock.l}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Open</p>
                            <p className="text-lg font-bold">${stock.o}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
