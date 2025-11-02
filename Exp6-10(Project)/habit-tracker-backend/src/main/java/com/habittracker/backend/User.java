package com.habittracker.backend;
// package com.habittracker.backend;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Document("users")
@Data
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    private String id;

    @Indexed(unique = true) // Make sure usernames are unique
    private String username;

    private String password; // This will be stored HASHED

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // --- UserDetails Methods ---
    // These methods are required by Spring Security

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For a simple app, we can return an empty list.
        // Or you could add a "roles" field (e.g., ROLE_USER)
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}