package cl.bordersync.backend.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.bordersync.backend.auth.dto.AuthResponse;
import cl.bordersync.backend.auth.dto.LoginRequest;
import cl.bordersync.backend.auth.dto.RegisterRequest;
import cl.bordersync.backend.common.ApiException;
import cl.bordersync.backend.user.AdminUserService;
import cl.bordersync.backend.user.AppUser;
import cl.bordersync.backend.user.UpdateUserAccessRequest;
import cl.bordersync.backend.user.UserRepository;
import cl.bordersync.backend.user.UserRole;
import cl.bordersync.backend.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

@SpringBootTest
class AuthServiceIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserRepository users;

    @BeforeEach
    void cleanDatabase() {
        users.deleteAll();
    }

    @Test
    void registerPersistsTravelerAndReturnsToken() {
        AuthResponse response = register("persona@correo.cl", "19.111.111-1");

        assertNotNull(response.token());
        assertEquals("Bearer", response.tokenType());
        assertEquals(UserRole.TRAVELER, response.user().role());
        assertTrue(users.existsByEmailIgnoreCase("persona@correo.cl"));
    }

    @Test
    void duplicateEmailIsRejected() {
        register("duplicado@correo.cl", "18.222.222-2");

        ApiException exception = assertThrows(ApiException.class,
                () -> register("duplicado@correo.cl", "17.333.333-3"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void correctCredentialsAllowLogin() {
        register("login@correo.cl", "16.444.444-4");

        AuthResponse response = authService.login(new LoginRequest("login@correo.cl", "Segura2026!"));

        assertNotNull(response.token());
        assertEquals("login@correo.cl", response.user().email());
    }

    @Test
    void fifthFailedAttemptLocksAccountForFifteenMinutes() {
        register("bloqueo@correo.cl", "15.555.555-5");

        for (int attempt = 1; attempt <= 4; attempt++) {
            ApiException exception = assertThrows(ApiException.class,
                    () -> authService.login(new LoginRequest("bloqueo@correo.cl", "incorrecta")));
            assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
        }

        ApiException fifthAttempt = assertThrows(ApiException.class,
                () -> authService.login(new LoginRequest("bloqueo@correo.cl", "incorrecta")));
        AppUser user = users.findByEmailIgnoreCase("bloqueo@correo.cl").orElseThrow();

        assertEquals(HttpStatus.LOCKED, fifthAttempt.getStatus());
        assertTrue(user.isTemporarilyLocked());
    }

    @Test
    void administratorChangesRemainPersisted() {
        AuthResponse registered = register("estado@correo.cl", "14.666.666-6");

        adminUserService.updateAccess(
                registered.user().id(), new UpdateUserAccessRequest(UserRole.CUSTOMS, UserStatus.BLOCKED),
                "admin@bordersync.cl");
        AppUser reloaded = users.findById(registered.user().id()).orElseThrow();

        assertEquals(UserRole.CUSTOMS, reloaded.getRole());
        assertEquals(UserStatus.BLOCKED, reloaded.getStatus());
        assertFalse(reloaded.isTemporarilyLocked());
    }

    private AuthResponse register(String email, String document) {
        return authService.register(new RegisterRequest(
                "Persona de Prueba", document, email, "Segura2026!"
        ));
    }
}
