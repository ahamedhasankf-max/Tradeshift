package org.group10.tradeshift.controllers;

import org.group10.tradeshift.entities.User;
import org.group10.tradeshift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        String email = user.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // THESE 3 LINES ARE ABSOLUTELY REQUIRED
        user.setCashBalance(10000.0);
        if (user.getCashBalance() == 0) {
            user.setCashBalance(10000.0);
        }
        user.setEnabled(true);
        user.setRole("ROLE_USER");

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);    }
}