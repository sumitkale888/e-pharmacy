package com.example.backend.controller;

import com.example.backend.model.Medicine;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:5173") // React Frontend connection
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MedicineRepository medicineRepository;

    // 1. Add Product Endpoint (Used by Admin)
    @PostMapping("/add")
    public ResponseEntity<Medicine> addMedicine(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) throws IOException {

        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setPrice(price);
        medicine.setStock(stock);
        medicine.setDescription(description);

        return ResponseEntity.ok(medicineService.addMedicine(medicine, image));
    }

    // 2. Get All Products Endpoint (Used by Home & Dashboard)
    @GetMapping("/all")
    public List<Medicine> getAll() {
        return medicineService.getAllMedicines();
    }

    // 3. Delete Product Endpoint (Used by Admin Dashboard)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        if(medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return ResponseEntity.ok("Product Deleted Successfully");
        }
        return ResponseEntity.status(404).body("Product Not Found");
    }

    // ... imports
// Class ke andar ye endpoint add karo:

    @PutMapping("/update/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setPrice(price);
        medicine.setStock(stock);
        medicine.setDescription(description);

        return ResponseEntity.ok(medicineService.updateMedicine(id, medicine, image));
    }
}