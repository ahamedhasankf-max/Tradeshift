package org.group10.tradeshift.repository;

import org.group10.tradeshift.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used in login & registration)
    Optional<User> findByEmail(String email);



    // Check if email already exists
    boolean existsByEmail(String email);


}