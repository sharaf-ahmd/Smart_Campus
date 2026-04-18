package smart.campus.Backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.Role;
import smart.campus.Backend.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    /**
     * Returns the current authenticated user's profile (id, name, email, role).
     * Called by the frontend after login to determine role-based routing.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String rawEmail = jwt.getClaimAsString("email");
        final String email = (rawEmail != null) ? rawEmail : jwt.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String rawEmail = jwt.getClaimAsString("email");
        final String email = (rawEmail != null) ? rawEmail : jwt.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String rawEmail = jwt.getClaimAsString("email");
        final String email = (rawEmail != null) ? rawEmail : jwt.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String rawEmail = jwt.getClaimAsString("email");
        final String email = (rawEmail != null) ? rawEmail : jwt.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String rawEmail = jwt.getClaimAsString("email");
        final String email = (rawEmail != null) ? rawEmail : jwt.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()));
    }

    /**
     * Registers a new USER account. This endpoint is PUBLIC.
     * Admin accounts are NEVER created via this endpoint — they are seeded via SQL.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        String oauthProviderId = body.get("oauthProviderId");

        if (email == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and email are required."));
        }

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists."));
        }

        User newUser = User.builder()
                .email(email)
                .name(name)
                .oauthProviderId(oauthProviderId)
                .role(Role.USER) // ALWAYS USER — never ADMIN here
                .build();

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of(
                "id", newUser.getId(),
                "name", newUser.getName(),
                "email", newUser.getEmail(),
                "role", newUser.getRole().name()));
    }
}
