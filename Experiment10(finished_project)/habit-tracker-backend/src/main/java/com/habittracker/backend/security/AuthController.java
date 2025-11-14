package com.habittracker.backend.security;

// package com.habittracker.backend.auth; // Can be in a new 'auth' package

import com.habittracker.backend.User;
import com.habittracker.backend.UserRepository;
import com.habittracker.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Request/Response DTOs (Data Transfer Objects)
// It's cleaner to use DTOs, but for simplicity, we can use Maps
// record AuthRequest(String username, String password) {}
// record AuthResponse(String token) {}

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        // Check if user already exists
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        // Create new user
        User user = new User(
                username,
                passwordEncoder.encode(password) // ALWAYS hash passwords
        );
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // If authentication is successful, get UserDetails
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate a JWT token
        String token = jwtService.generateToken(userDetails);

        // Return the token
        return ResponseEntity.ok(Map.of("token", token));
    }
}