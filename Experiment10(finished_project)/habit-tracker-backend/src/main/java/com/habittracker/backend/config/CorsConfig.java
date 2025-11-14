package com.habittracker.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow your React app's origin
        // IMPORTANT: Use the specific origin, not "*" if you're using credentials
        configuration.setAllowedOrigins(List.of(
                "http://127.0.0.1:5173",
                "http://localhost:5173"
        ));

        // Allow all standard methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        // Allow specific headers, especially Authorization
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

        // Allow credentials (like cookies or auth tokens)
        configuration.setAllowCredentials(true);

        // Set max age for preflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}