package org.group10.tradeshift.services;

import org.group10.tradeshift.entities.User;
import org.group10.tradeshift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String emailLower = email.toLowerCase().trim();
        User user = userRepository.findByEmail(emailLower)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + emailLower));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())    // ← email is used as username
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}
