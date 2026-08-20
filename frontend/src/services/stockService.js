const API_KEY = "d42cug9r01qorleqp42gd42cug9r01qorleqp430";
const BASE_URL = "https://finnhub.io/api/v1/quote";

export async function getStockPrice(symbol) {
  try {
    const response = await fetch(`${BASE_URL}?symbol=${symbol}&token=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch stock data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching stock:", error);
    return null;
  }
}
