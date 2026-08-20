import React, { useEffect, useState } from "react";
import api from '../services/api';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let interval;

    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/api/portfolio');
        if (isMounted) {
          setPortfolio(response.data);
          setError(null);
          setLoading(false); // ← Only hide loading after first success
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load portfolio:", err);
          setError("Failed to load your portfolio. Please login again.");
          setLoading(false); // ← Prevent infinite loading
          if (err.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
          }
        }
      }
    };

    // First load
    fetchPortfolio();

    // Auto-refresh every 5 seconds (silent)
    interval = setInterval(() => {
      fetchPortfolio();
    }, 5000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // ← Run once

  // Show loading only on first load
  if (loading && !portfolio) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl">Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!portfolio) {
    return <div className="p-8">No portfolio data</div>;
  }

  const isEmpty = !portfolio.numAssets || portfolio.numAssets === 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">My Portfolio</h1>

      {/* Cash Balance */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Cash Balance</h2>
        <p className="text-3xl font-bold text-green-600 mt-2">
          ${portfolio.cashBalance?.toFixed(2) || "0.00"}
        </p>
      </div>

      {/* Holdings Table */}
      {!isEmpty ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Symbol</th>
                <th className="py-4 px-6 text-right">Quantity</th>
                <th className="py-4 px-6 text-right">Avg Cost</th>
                <th className="py-4 px-6 text-right">Current Price</th>
                <th className="py-4 px-6 text-right">Total Value</th>
                <th className="py-4 px-6 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(portfolio.allocations || {}).map(([symbol, allocation]) => {
  const qty = portfolio.netHoldings?.[symbol] || 0;
  const cost = portfolio.costBasis?.[symbol] || 0;
  const avgCost = qty > 0 ? cost / qty : 0;
  const currentPrice = portfolio.livePrices?.[symbol] || 0;
  const totalValue = qty * currentPrice;
  const pnl = totalValue - cost;

  return (
    <tr key={symbol} className="border-b hover:bg-gray-50">
      <td className="py-4 px-6 font-mono">{symbol}</td>
      <td className="py-4 px-6 text-right">{qty.toFixed(2)}</td>
      <td className="py-4 px-6 text-right">${avgCost.toFixed(2)}</td>
      <td className="py-4 px-6 text-right">${currentPrice.toFixed(2)}</td>
      <td className="py-4 px-6 text-right font-semibold">
        ${totalValue.toFixed(2)}
      </td>
      <td className={`py-4 px-6 text-right font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
      </td>
    </tr>
  );
})}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-md text-center text-gray-600 mb-8">
          <p className="text-xl">Your portfolio is empty</p>
          <p>Go to the Buy page to purchase your first stock!</p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Total Value</h3>
          <p className="text-2xl font-bold text-blue-700">
            ${portfolio.totalValue?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Unrealized P&L</h3>
          <p className={`text-2xl font-bold ${portfolio.unrealizedPl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {portfolio.unrealizedPl >= 0 ? "+" : ""}${portfolio.unrealizedPl?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Number of Assets</h3>
          <p className="text-2xl font-bold text-purple-700">
            {portfolio.numAssets || 0}
          </p>
        </div>
      </div>
    </div>
  );
}