package org.group10.tradeshift.entities;

import jakarta.persistence.*;
import lombok.*;
import org.group10.tradeshift.entities.User;

import java.util.Date;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "price")
    private Double price;

    @Column(name = "type")          // "BUY" or "SELL"
    private String type;

    @Column(name = "timestamp")
    private Date timestamp = new Date();

    public Transaction(String symbol, Double quantity, Double price, String type, User user) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
        this.user = user;
        this.timestamp = new Date();
    }
}