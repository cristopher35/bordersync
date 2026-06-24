package cl.bordersync.backend.auth.dto;

public record AuthResponse(String token, String tokenType, long expiresInSeconds, UserResponse user) {
}
