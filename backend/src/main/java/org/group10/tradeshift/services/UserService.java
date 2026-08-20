// src/main/java/org/group10/tradeshift/services/UserService.java

package org.group10.tradeshift.services;

import lombok.RequiredArgsConstructor;
import org.group10.tradeshift.entities.User;
import org.group10.tradeshift.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default values
        if (user.getCashBalance() == 0.0) {
            user.setCashBalance(10000.0);
        }

        // Optional: if you have username field, set it to email
        // user.setUsername(user.getEmail());

        return userRepository.save(user);
    }
}