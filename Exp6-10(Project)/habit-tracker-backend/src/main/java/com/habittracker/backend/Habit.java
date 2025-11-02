 package com.habittracker.backend;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document("habits")
@Data
public class Habit {

    @Id
    private String id;

    // NEW FIELD
    private String userId; // Stores the ID of the user who owns this habit

    private String name;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastCompletedDate;

    // Updated constructor
    public Habit(String name, String userId) {
        this.name = name;
        this.userId = userId; // Set the owner
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.lastCompletedDate = null;
    }

    // Lombok @Data provides the empty constructor
}