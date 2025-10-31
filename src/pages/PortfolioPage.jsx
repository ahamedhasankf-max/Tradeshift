import React, { useState } from "react";

export default function PortfolioPage() {
    const [assets] = useState([
        { name: "Apple (AAPL)", quantity: 10, price: 190.23 },
        { name: "Tesla (TSLA)", quantity: 5, price: 225.67 },
        { name: "Amazon (AMZN)", quantity: 8, price: 133.88 },
    ]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                My Portfolio
            </h1>

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
                        <td className="py-2 px-4">${asset.price}</td>
                        <td className="py-2 px-4 font-semibold">
                            ${(asset.quantity * asset.price).toFixed(2)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
