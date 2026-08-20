package org.group10.tradeshift.repository;

import org.group10.tradeshift.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);

    // ---------- NET HOLDINGS ----------
    @Query(value = """
        SELECT symbol,
               SUM(CASE WHEN type = 'BUY'  THEN quantity ELSE -quantity END) AS net_qty
        FROM transactions
        WHERE user_id = :userId
        GROUP BY symbol
        HAVING SUM(CASE WHEN type = 'BUY'  THEN quantity ELSE -quantity END) > 0
        """, nativeQuery = true)
    List<Object[]> findNetHoldingsByUserId(@Param("userId") Long userId);

    // ---------- COST BASIS ----------
    @Query(value = """
        SELECT symbol,
               SUM(quantity * price) AS total_cost
        FROM transactions
        WHERE user_id = :userId AND type = 'BUY'
        GROUP BY symbol
        """, nativeQuery = true)
    List<Object[]> findCostBasisByUserId(@Param("userId") Long userId);
}