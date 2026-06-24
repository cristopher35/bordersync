package cl.bordersync.backend.user;

import cl.bordersync.backend.auth.dto.UserResponse;
import cl.bordersync.backend.common.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService {

    private final UserRepository users;

    public AdminUserService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return users.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional
    public UserResponse updateAccess(Long id, UpdateUserAccessRequest request, String actorEmail) {
        if (request.role() == null && request.status() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Debe indicar un rol o estado");
        }
        AppUser user = users.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        boolean removesOwnAdminAccess = user.getEmail().equalsIgnoreCase(actorEmail)
                && (request.status() == UserStatus.BLOCKED
                || (request.role() != null && request.role() != UserRole.ADMIN));
        if (removesOwnAdminAccess) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No puedes quitar tu propio acceso de administrador");
        }
        user.updateAccess(request.role(), request.status());
        return UserResponse.from(users.save(user));
    }
}
