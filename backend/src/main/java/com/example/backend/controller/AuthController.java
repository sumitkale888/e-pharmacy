package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists!";
        }

        // AGAR ROLE KHALI HAI TO 'USER' SET KARO (Default)
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        // Agar frontend se "ADMIN" bheja gaya hai, toh wo waisa hi rahega

        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User loginDetails) {
        User user = userRepository.findByUsername(loginDetails.getUsername()).orElse(null);
        
        if (user != null && user.getPassword().equals(loginDetails.getPassword())) {
            return user;
        }
        return null;
    }
}