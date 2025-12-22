package com.example.backend.service;

import com.example.backend.model.Medicine;
import com.example.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Import Value
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    // Read the path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    public Medicine addMedicine(Medicine medicine, MultipartFile image) throws IOException {
        // 1. Create the folder path object
        Path uploadPath = Paths.get(uploadDir);
        
        // 2. Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 3. Save the file
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 4. Save details to DB
        medicine.setImageName(fileName);
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // ... imports
// Class ke andar ye method paste karo:

    public Medicine updateMedicine(Long id, Medicine newData, MultipartFile image) throws IOException {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Text fields update karo
        existing.setName(newData.getName());
        existing.setCategory(newData.getCategory());
        existing.setPrice(newData.getPrice());
        existing.setStock(newData.getStock());
        existing.setDescription(newData.getDescription());

        // Agar nayi image aayi hai, tabhi update karo
        if (image != null && !image.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            existing.setImageName(fileName); // Database mein naya naam save karo
        }

        return medicineRepository.save(existing);
    }
}