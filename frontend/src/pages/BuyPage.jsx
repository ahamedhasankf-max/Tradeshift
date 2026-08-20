import React, { useState } from "react";
import api from '../services/api';

export default function BuyPage() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const FINNHUB_KEY = "d42cug9r01qorleqp42gd42cug9r01qorleqp430"; // Your key

  const searchStock = async () => {
    if (!symbol.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_KEY}`
      );
      const data = await res.json();
      if (data.c) {
        setPrice(data.c);
        setMessage(`Current price: $${data.c.toFixed(2)}`);
      } else {
        setMessage("Stock not found!");
        setPrice(null);
      }
    } catch (err) {
      setMessage("Error fetching price");
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async () => {
    if (!price || !quantity || quantity <= 0) {
      setMessage("Invalid quantity or price");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/portfolio/buy', {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        price: price
      });

      setMessage(`SUCCESS! Bought ${quantity} × ${symbol.toUpperCase()} at $${price.toFixed(2)}`);
      setSymbol("");
      setQuantity("");
      setPrice(null);
      setTimeout(() => {
      window.location.href = "/portfolio";  // Full reload → shows updated cash & stocks
    }, 1500);
    } catch (err) {
      setMessage(err.response?.data || "Failed to buy stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Buy Stocks</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">Stock Symbol</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. AAPL"
                className="flex-1 px-4 py-3 border rounded-lg text-xl uppercase"
                onKeyPress={(e) => e.key === 'Enter' && searchStock()}
              />
              <button
                onClick={searchStock}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>

          {price && (
            <>
              <div className="text-2xl font-bold text-green-600">
                Current Price: ${price.toFixed(2)}
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="How many shares?"
                  className="w-full px-4 py-3 border rounded-lg text-xl"
                  min="1"
                />
              </div>

              <div className="text-xl font-semibold">
                Total Cost: ${(price * (quantity || 0)).toFixed(2)}
              </div>

              <button
                onClick={buyStock}
                disabled={loading || !quantity}
                className="w-full py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "BUY NOW"}
              </button>
            </>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center text-lg font-medium ${
              message.includes("SUCCESS") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <a href="/portfolio" className="text-indigo-600 hover:underline text-lg">
          ← Back to Portfolio
        </a>
      </div>
    </div>
  );
}