package org.group10.tradeshift.services;
//add the package of the reprensented class
//here i assumed you added portfolio n transaction in m1 package
import org.group10.tradeshift.entities.*;
import org.group10.tradeshift.repository.TransactionRepository;
import org.group10.tradeshift.repository.UserRepository;
import org.group10.tradeshift.websocket.*;  // For prices
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PortfolioService {
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private UserRepository userRepo;
    private final FinnhubWebSocketClient finnhubClient;


    public PortfolioService(
            @Lazy
            FinnhubWebSocketClient finnhubClient,
            TransactionRepository transactionRepo

    ) {
        this.finnhubClient = finnhubClient;
        this.transactionRepo = transactionRepo;

    }  // Assume we have a price cache/map

    // Cache live prices: symbol -> price (updated via WS)
    private final Map<String, Double> livePrices = new HashMap<>();

    // Update price from WS (call this in Finnhub handler)
    public void updateLivePrice(String symbol, Double price) {
        livePrices.put(symbol, price);
        System.out.println("Updated price: " + symbol + " = $" + price);
    }

    @Transactional(readOnly = true)
    public Portfolio getPortfolio(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get net holdings and cost basis from DB queries
        Map<String, Double> netHoldings = transactionRepo.findNetHoldingsByUserId(userId).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> ((Number) row[1]).doubleValue()
                ));

        Map<String, Double> costBasis = transactionRepo.findCostBasisByUserId(userId).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> ((Number) row[1]).doubleValue()
                ));

        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);

        double totalPortfolioValue = 0.0;
        double totalUnrealizedPnL = 0.0;
        Map<String, Double> allocations = new HashMap<>();

        // First pass: calculate total value and unrealized P&L
        double unrealizedPnL = 0;
        for (Map.Entry<String, Double> entry : netHoldings.entrySet()) {
            String symbol = entry.getKey();
            double quantity = entry.getValue();

            if (quantity <= 0) continue; // skip sold-out positions

            double currentPrice = livePrices.getOrDefault(symbol, fetchCurrentPrice(symbol));
            livePrices.put(symbol, currentPrice);
            double marketValue = quantity * currentPrice;
            double cost = costBasis.getOrDefault(symbol, 0.0);
            unrealizedPnL = marketValue - cost;

            totalPortfolioValue += marketValue;
            totalUnrealizedPnL += unrealizedPnL;
        }

        // Second pass: calculate correct allocation % (now we know final total)
        for (Map.Entry<String, Double> entry : netHoldings.entrySet()) {
            String symbol = entry.getKey();
            double quantity = entry.getValue();

            if (quantity <= 0) continue;

            double currentPrice = livePrices.getOrDefault(symbol, fetchCurrentPrice(symbol));
            double marketValue = quantity * currentPrice;

            double allocationPct = totalPortfolioValue > 0
                    ? (marketValue / totalPortfolioValue) * 100
                    : 0.0;

            allocations.put(symbol, Math.round(allocationPct * 100.0) / 100.0); // 2 decimals
        }

        // CORRECT WAY to calculate Realized P&L
        double initialCapital = 10000.0;
        double currentTotalWealth = user.getCashBalance() + totalPortfolioValue;
        double totalInvested = initialCapital + totalUnrealizedPnL; // not needed directly
        double realizedPnL = currentTotalWealth - initialCapital - totalUnrealizedPnL;

        // Set portfolio fields

        portfolio.setTotalValue(round(totalPortfolioValue));
        portfolio.setCashBalance(round(user.getCashBalance()));
        portfolio.setUnrealizedPl(round(totalUnrealizedPnL));
        portfolio.setRealizedPl(round(realizedPnL));
        portfolio.setTotalPl(round(realizedPnL + totalUnrealizedPnL));
        portfolio.setNumAssets(netHoldings.size());
        portfolio.setUnrealizedPl(round(unrealizedPnL));
        portfolio.setAllocations(allocations);

        // ADD THESE 3 LINES
        portfolio.setNetHoldings(netHoldings);         // { "AAPL": 5.0 }
        portfolio.setCostBasis(costBasis);             // { "AAPL": 800.0 }
        portfolio.setLivePrices(livePrices);


        System.out.println(">>> getPortfolio userId = " + userId);

        List<Object[]> rawHoldings = transactionRepo.findNetHoldingsByUserId(userId);
        System.out.println(">>> rawHoldings = " + rawHoldings);

        List<Object[]> rawCost = transactionRepo.findCostBasisByUserId(userId);
        System.out.println(">>> rawCost = " + rawCost);


        return portfolio;
    }

    // Helper method
    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Double fetchCurrentPrice(String symbol) {
        finnhubClient.subscribe(symbol);  // triggers WS
        // Wait a bit or return fallback
        try { Thread.sleep(500); } catch (Exception e) {}
        return livePrices.getOrDefault(symbol, 160.0); // fallback
    }


    public void recalculateOnPriceChange(String symbol, Double newPrice) {
        updateLivePrice(symbol, newPrice);

    }
    public double calculateDiversificationScore(Map<String, Double> allocations) {
        return allocations.values().stream()
                .map(pct -> Math.pow(pct / 100, 2))
                .mapToDouble(Double::doubleValue)
                .sum();
    }
    public void updateStockPrice(String symbol, double price) {
        livePrices.put(symbol, price);

    }
    @Transactional
    public Transaction executeBuyOrder(Long userId, String symbol, Double quantity, Double price) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double totalCost = quantity * price;
        if (user.getCashBalance() < totalCost) {
            throw new RuntimeException("Insufficient funds");
        }

        // DEDUCT CASH
        user.setCashBalance(user.getCashBalance() - totalCost);
        userRepo.save(user);                     // <-- MUST SAVE

        // SAVE TRANSACTION
        Transaction tx = new Transaction(symbol, quantity, price, "BUY", user);
        return transactionRepo.save(tx);
    }
    public Double getCurrentPrice(String symbol) {
        return livePrices.getOrDefault(symbol, fetchCurrentPrice(symbol));
    }
}
