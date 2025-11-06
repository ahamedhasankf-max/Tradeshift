import React, { useEffect, useState } from "react";

export default function PortfolioPage() {
    const [assets, setAssets] = useState([
        { name: "Apple (AAPL)", symbol: "AAPL", quantity: 10 },
        { name: "Tesla (TSLA)", symbol: "TSLA", quantity: 5 },
        { name: "Amazon (AMZN)", symbol: "AMZN", quantity: 8 },
    ]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "d42cug9r01qorleqp42gd42cug9r01qorleqp430";
    const BASE_URL = "https://finnhub.io/api/v1/quote";

    async function fetchStockData() {
        try {
            setLoading(true);
            setError(null);

            const responses = await Promise.all(
                assets.map((asset) =>
                    fetch(`${BASE_URL}?symbol=${asset.symbol}&token=${API_KEY}`)
                )
            );

            const data = await Promise.all(responses.map((res) => res.json()));

            const updatedAssets = assets.map((asset, index) => ({
                ...asset,
                price: data[index].c,
            }));

            setAssets(updatedAssets);
        } catch (err) {
            setError("Failed to fetch stock data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStockData();
        const interval = setInterval(fetchStockData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                My Portfolio
            </h1>

            {loading && <p>Loading latest prices...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full bg-white rounded-xl shadow-md">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="py-2 px-4 text-left">Asset</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{asset.name}</td>
                                <td className="py-2 px-4">{asset.quantity}</td>
                                <td className="py-2 px-4">
                                    ${asset.price ? asset.price.toFixed(2) : "—"}
                                </td>
                                <td className="py-2 px-4 font-semibold">
                                    {asset.price
                                        ? `$${(asset.quantity * asset.price).toFixed(2)}`
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
