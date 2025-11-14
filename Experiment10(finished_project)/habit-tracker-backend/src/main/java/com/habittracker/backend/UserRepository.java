package com.habittracker.backend;

// package com.habittracker.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Spring Data MongoDB will automatically create this query for us
    Optional<User> findByUsername(String username);
}