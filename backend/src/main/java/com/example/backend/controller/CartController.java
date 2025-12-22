package com.example.backend.controller;

import com.example.backend.model.CartItem;
import com.example.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired private CartService cartService;

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId, @RequestParam Long medicineId, @RequestParam int quantity) {
        return cartService.addToCart(userId, medicineId, quantity);
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @DeleteMapping("/remove/{id}")
    public void removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
    }
}