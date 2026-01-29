package com.cengavers.features.user.controller;

import com.cengavers.features.user.dto.UserDTO;
import com.cengavers.features.user.dto.request.CreateUserRequest;
import com.cengavers.features.user.dto.request.UpdateRoleRequest;
import com.cengavers.features.user.dto.request.UpdateUserRequest;
import com.cengavers.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody CreateUserRequest request) {
        userService.save(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save-admin")
    public ResponseEntity<Void> createAdmin(@RequestBody CreateUserRequest request) {
        userService.saveAdmin(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findByUserId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateById(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        userService.updateById(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestBody UpdateRoleRequest request) {
        userService.updateUserRole(id, request.getRoleId());
        return ResponseEntity.ok().build();
    }
}
