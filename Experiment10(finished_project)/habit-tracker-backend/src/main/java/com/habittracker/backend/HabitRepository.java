 package com.habittracker.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface HabitRepository extends MongoRepository<Habit, String> {

    // Find all habits for a specific user
    List<Habit> findByUserId(String userId);

    // Find a single habit by its ID AND the user's ID
    // This is crucial for security!
    Optional<Habit> findByIdAndUserId(String id, String userId);

    // This will be used for deleting
    void deleteByIdAndUserId(String id, String userId);
}