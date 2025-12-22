package com.example.backend.service;

import com.example.backend.model.CartItem;
import com.example.backend.model.Medicine;
import com.example.backend.model.User;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private MedicineRepository medicineRepository;
    @Autowired private UserRepository userRepository;

    public CartItem addToCart(Long userId, Long medicineId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow(() -> new RuntimeException("Medicine not found"));

        // Check if item exists
        CartItem cartItem = cartItemRepository.findByUserAndMedicineId(user, medicineId)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setUser(user);
            cartItem.setMedicine(medicine);
            cartItem.setQuantity(0);
        }
        
        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getCartItems(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return cartItemRepository.findByUser(user);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }
}