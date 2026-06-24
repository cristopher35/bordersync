package cl.bordersync.backend.config;

import cl.bordersync.backend.user.UserRepository;
import cl.bordersync.backend.user.UserStatus;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ActiveUserFilter extends OncePerRequestFilter {

    private final UserRepository users;

    public ActiveUserFilter(UserRepository users) {
        this.users = users;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            boolean active = users.findByEmailIgnoreCase(jwtAuthentication.getToken().getSubject())
                    .map(user -> user.getStatus() == UserStatus.ACTIVE)
                    .orElse(false);
            if (!active) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"La cuenta está bloqueada o ya no existe\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
