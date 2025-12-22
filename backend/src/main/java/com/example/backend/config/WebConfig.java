package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // "file:///" is required for Windows absolute paths
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/pharmacy-uploads/medicines/");
    }
}