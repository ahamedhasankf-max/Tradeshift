package org.group10.tradeshift.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Portfolio {
    @Id @GeneratedValue
    private Long id;

    @OneToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double totalValue = 0.0;  // Cached; update via service
    private Double unrealizedPl = 0.0;
    private Double cashBalance = 0.0;           // We will set this from user

    private Double realizedPl = 0.0;
    private Double totalPl = 0.0;               // realized + unrealized

    private Integer numAssets = 0;


    @ElementCollection
    @CollectionTable(name = "portfolio_allocations", joinColumns = @JoinColumn(name = "portfolio_id"))
    @MapKeyColumn(name = "symbol")
    @Column(name = "allocation_percent")
    private Map<String, Double> allocations = new HashMap<>();;

    @Transient
    private Map<String, Double> netHoldings = new HashMap<>();

    public Map<String, Double> getCostBasis() {
        return costBasis;
    }

    public void setCostBasis(Map<String, Double> costBasis) {
        this.costBasis = costBasis;
    }

    public Map<String, Double> getNetHoldings() {
        return netHoldings;
    }

    public void setNetHoldings(Map<String, Double> netHoldings) {
        this.netHoldings = netHoldings;
    }

    public Map<String, Double> getLivePrices() {
        return livePrices;
    }

    public void setLivePrices(Map<String, Double> livePrices) {
        this.livePrices = livePrices;
    }

    @Transient
    private Map<String, Double> costBasis = new HashMap<>();

    @Transient
    private Map<String, Double> livePrices = new HashMap<>();




    public void setRealizedPl(Double realizedPl) {
        this.realizedPl = realizedPl;
    }

    public Double getTotalPl() {
        return totalPl;
    }

    public void setTotalPl(Double totalPl) {
        this.totalPl = totalPl;
    }

    public void setNumAssets(Integer numAssets) {
        this.numAssets = numAssets;
    }

    public Double getCashBalance() {
        return cashBalance;
    }

    public void setCashBalance(Double cashBalance) {
        this.cashBalance = cashBalance;
    }

    public Map<String, Double> getAllocations() {
        return allocations;
    }

    public void setAllocations(Map<String, Double> allocations) {
        this.allocations = allocations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getUnrealizedPl() {
        return unrealizedPl;
    }

    public void setUnrealizedPl(Double unrealizedPl) {
        this.unrealizedPl = unrealizedPl;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }

    public double getRealizedPl() { return realizedPl; }
    public void setRealizedPl(double realizedPl) { this.realizedPl = realizedPl; }

    public int getNumAssets() { return numAssets; }
    public void setNumAssets(int numAssets) { this.numAssets = numAssets; }


}
