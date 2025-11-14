 package com.habittracker.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Import this
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository; // Need this to get user ID

    // A helper method to get the User ID from the Principal
    private String getUserId(Principal principal) {
        String username = principal.getName();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @GetMapping
    public List<Habit> getAllHabits(Principal principal) {
        // Only return habits for the logged-in user
        String userId = getUserId(principal);
        return habitRepository.findByUserId(userId);
    }

    @PostMapping
    public Habit createHabit(@RequestBody Map<String, String> body, Principal principal) {
        String userId = getUserId(principal);
        String name = body.get("name");

        // Associate the new habit with the user
        Habit newHabit = new Habit(name, userId);
        return habitRepository.save(newHabit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable String id, Principal principal) {
        String userId = getUserId(principal);

        // We must check if the habit exists AND belongs to the user
        Optional<Habit> habit = habitRepository.findByIdAndUserId(id, userId);

        if (habit.isEmpty()) {
            // Either it doesn't exist, or it's not theirs.
            // Return 'not found' for security.
            return ResponseEntity.notFound().build();
        }

        habitRepository.deleteById(id); // Safe to delete now
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Habit> completeHabit(@PathVariable String id, Principal principal) {
        String userId = getUserId(principal);

        // Find the habit *by its ID and the user's ID*
        Optional<Habit> optionalHabit = habitRepository.findByIdAndUserId(id, userId);

        if (optionalHabit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // --- The rest of your logic is the same ---
        Habit habit = optionalHabit.get();
        LocalDate today = LocalDate.now();

        if (habit.getLastCompletedDate() != null && habit.getLastCompletedDate().equals(today)) {
            return ResponseEntity.ok(habit);
        }

        LocalDate yesterday = today.minusDays(1);

        if (habit.getLastCompletedDate() != null && habit.getLastCompletedDate().equals(yesterday)) {
            habit.setCurrentStreak(habit.getCurrentStreak() + 1);
        } else {
            habit.setCurrentStreak(1);
        }

        if (habit.getCurrentStreak() > habit.getLongestStreak()) {
            habit.setLongestStreak(habit.getLongestStreak());
        }

        habit.setLastCompletedDate(today);

        Habit updatedHabit = habitRepository.save(habit);
        return ResponseEntity.ok(updatedHabit);
    }
}