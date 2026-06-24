package cl.bordersync.backend.auth;

import cl.bordersync.backend.auth.dto.AuthResponse;
import cl.bordersync.backend.auth.dto.LoginRequest;
import cl.bordersync.backend.auth.dto.RegisterRequest;
import cl.bordersync.backend.auth.dto.UserResponse;
import cl.bordersync.backend.common.ApiException;
import cl.bordersync.backend.user.AppUser;
import cl.bordersync.backend.user.UserRepository;
import cl.bordersync.backend.user.UserRole;
import cl.bordersync.backend.user.UserStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final Duration tokenDuration;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder,
                       @Value("${app.jwt.expiration-hours:8}") long expirationHours) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.tokenDuration = Duration.ofHours(expirationHours);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String document = request.documentNumber().trim().toUpperCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }
        if (users.existsByDocumentNumberIgnoreCase(document)) {
            throw new ApiException(HttpStatus.CONFLICT, "El documento ya está registrado");
        }
        AppUser user = new AppUser(
                request.fullName().trim(), document, email,
                passwordEncoder.encode(request.password()), UserRole.TRAVELER
        );
        return issueToken(users.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "La cuenta está bloqueada por un administrador");
        }
        if (user.isTemporarilyLocked()) {
            throw new ApiException(HttpStatus.LOCKED, "Cuenta bloqueada temporalmente por 15 minutos");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            user.recordFailedAttempt();
            users.save(user);
            if (user.isTemporarilyLocked()) {
                throw new ApiException(HttpStatus.LOCKED, "Cuenta bloqueada temporalmente por 15 minutos");
            }
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        }
        user.clearFailedAttempts();
        users.save(user);
        return issueToken(user);
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .map(UserResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private AuthResponse issueToken(AppUser user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("bordersync")
                .issuedAt(now)
                .expiresAt(now.plus(tokenDuration))
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("roles", List.of(user.getRole().name()))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new AuthResponse(token, "Bearer", tokenDuration.toSeconds(), UserResponse.from(user));
    }
}
