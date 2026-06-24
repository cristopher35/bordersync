package cl.bordersync.backend.config;

import cl.bordersync.backend.user.AppUser;
import cl.bordersync.backend.user.UserRepository;
import cl.bordersync.backend.user.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BootstrapData {

    @Bean
    CommandLineRunner createDevelopmentAdmin(
            UserRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin-email}") String email,
            @Value("${app.bootstrap.admin-password}") String password) {
        return args -> {
            String normalizedEmail = email.trim().toLowerCase();
            if (!users.existsByEmailIgnoreCase(normalizedEmail)) {
                users.save(new AppUser(
                        "Administrador BorderSync", "ADMIN-001", normalizedEmail,
                        passwordEncoder.encode(password), UserRole.ADMIN
                ));
            }
        };
    }
}
