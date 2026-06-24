package cl.bordersync.backend.auth.dto;

import cl.bordersync.backend.user.AppUser;
import cl.bordersync.backend.user.UserRole;
import cl.bordersync.backend.user.UserStatus;
import java.time.Instant;

public record UserResponse(
        Long id,
        String fullName,
        String documentNumber,
        String email,
        UserRole role,
        UserStatus status,
        Instant lockedUntil,
        Instant createdAt
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(), user.getFullName(), user.getDocumentNumber(), user.getEmail(),
                user.getRole(), user.getStatus(), user.getLockedUntil(), user.getCreatedAt()
        );
    }
}
