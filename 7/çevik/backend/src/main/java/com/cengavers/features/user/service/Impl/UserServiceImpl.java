package com.cengavers.features.user.service.Impl;

import com.cengavers.features.role.entity.Role;
import com.cengavers.features.role.repository.RoleRepository;
import com.cengavers.features.role.service.RoleService;
import com.cengavers.features.user.dto.UserDTO;

import com.cengavers.features.user.dto.converter.UserDTOConverter;
import com.cengavers.features.user.dto.request.CreateUserRequest;
import com.cengavers.features.user.dto.request.UpdateUserRequest;
import com.cengavers.features.user.entity.User;
import com.cengavers.features.user.repository.UserRepository;
import com.cengavers.features.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final UserDTOConverter userDTOConverter;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void save(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists : " + request.getUsername());
        }
        Role role = roleService.findByRoleName("user");
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(roleService.findByRoleName(role.getName()));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    public void saveAdmin(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists : " + request.getUsername());
        }
        Role role = roleService.findByRoleName("admin");
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(roleService.findByRoleName(role.getName()));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateById(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found id : " + id));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoleId() != null) {
            var role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found id=" + request.getRoleId()));
            user.setRole(role);
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }

        if (request.getClassYear() != null) {
            user.setClassYear(request.getClassYear());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }

        if (request.getHobby() != null) {
            user.setHobby(request.getHobby());
        }
    }

    @Override
    public void deleteById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User cannot found to delete with id: " + id));
        userRepository.delete(user);
    }

    @Override
    public List<UserDTO> findAll() {
        return userDTOConverter.convert(userRepository.findAll());
    }

    @Override
    public User findByUsernameReturnUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found by username : " + username));
    }

    @Override
    public UserDTO findByUserId(Long id) {
        return userDTOConverter.convert(
                userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found: " + id)));
    }

    @Override
    public UserDTO findByUsername(String username) {
        return userDTOConverter.convert(
                userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User Not Found: " + username)));
    }

    @Override
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("No authenticated user");
        }
        var user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found: " + authentication.getName()));
        return userDTOConverter.convert(user);
    }

    @Override
    public boolean existByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public void updateUserRole(Long userId, Long roleId) {
        if (roleId == null) {
            throw new RuntimeException("Role ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found id: " + roleId));
        user.setRole(role);
        userRepository.save(user);
    }
}
