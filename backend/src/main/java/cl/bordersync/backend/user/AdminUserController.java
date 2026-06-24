package cl.bordersync.backend.user;

import cl.bordersync.backend.auth.dto.UserResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService service;

    public AdminUserController(AdminUserService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return service.findAll();
    }

    @PatchMapping("/{id}/access")
    public UserResponse updateAccess(@PathVariable Long id, @RequestBody UpdateUserAccessRequest request,
                                     @AuthenticationPrincipal Jwt jwt) {
        return service.updateAccess(id, request, jwt.getSubject());
    }
}
