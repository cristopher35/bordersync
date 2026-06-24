package cl.bordersync.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "app_users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_user_document", columnNames = "document_number")
})
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "document_number", nullable = false, length = 40)
    private String documentNumber;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole role = UserRole.TRAVELER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "failed_attempts", nullable = false)
    private int failedAttempts;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AppUser() {
    }

    public AppUser(String fullName, String documentNumber, String email, String passwordHash, UserRole role) {
        this.fullName = fullName;
        this.documentNumber = documentNumber;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = UserStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getDocumentNumber() { return documentNumber; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public UserRole getRole() { return role; }
    public UserStatus getStatus() { return status; }
    public int getFailedAttempts() { return failedAttempts; }
    public Instant getLockedUntil() { return lockedUntil; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void recordFailedAttempt() {
        failedAttempts++;
        if (failedAttempts >= 5) {
            lockedUntil = Instant.now().plusSeconds(15 * 60L);
        }
        updatedAt = Instant.now();
    }

    public void clearFailedAttempts() {
        failedAttempts = 0;
        lockedUntil = null;
        updatedAt = Instant.now();
    }

    public boolean isTemporarilyLocked() {
        return lockedUntil != null && lockedUntil.isAfter(Instant.now());
    }

    public void updateAccess(UserRole role, UserStatus status) {
        if (role != null) this.role = role;
        if (status != null) this.status = status;
        updatedAt = Instant.now();
    }
}
