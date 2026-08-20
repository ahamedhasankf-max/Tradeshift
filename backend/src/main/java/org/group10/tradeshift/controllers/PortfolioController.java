package org.group10.tradeshift.controllers;

import lombok.RequiredArgsConstructor;
import org.group10.tradeshift.entities.Portfolio;
import org.group10.tradeshift.entities.Transaction;
import org.group10.tradeshift.entities.User;
import org.group10.tradeshift.repository.UserRepository;
import org.group10.tradeshift.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor  // Lombok
public class PortfolioController {

    private final PortfolioService portfolioService;  // INJECT


    @PostMapping("/buy")
    public ResponseEntity<Transaction> buyAsset(@RequestBody OrderRequest order, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);

        // GET REAL PRICE FROM CACHE OR FINNHUB
        Double currentPrice = portfolioService.getCurrentPrice(order.getSymbol());
        if (currentPrice == 0.0) {
            throw new RuntimeException("Price not available for " + order.getSymbol());
        }

        Transaction tx = portfolioService.executeBuyOrder(
                userId, order.getSymbol(), order.getQuantity(), currentPrice);

        return ResponseEntity.ok(tx);
    }

    // In PortfolioController.java and any protected controller
    @Autowired
    private UserRepository UserRepository;
    private Long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName(); // This is your JWT subject (email)
        User user = UserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<?> getCurrentPortfolio(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();
        User user = UserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Portfolio portfolio = portfolioService.getPortfolio(user.getId());
        return ResponseEntity.ok(portfolio);
    }
}
