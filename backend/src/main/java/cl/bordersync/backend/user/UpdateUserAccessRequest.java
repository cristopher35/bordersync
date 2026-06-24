package cl.bordersync.backend.user;

public record UpdateUserAccessRequest(UserRole role, UserStatus status) {
}
