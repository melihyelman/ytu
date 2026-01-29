package com.cengavers.features.auth.service.Impl;


import com.cengavers.features.auth.dto.request.signInRequest;
import com.cengavers.features.auth.dto.request.signUpRequest;
import com.cengavers.features.auth.dto.signInDTO;
import com.cengavers.features.auth.dto.signUpDTO;
import com.cengavers.features.auth.service.AuthService;
import com.cengavers.features.auth.service.JwtService;
import com.cengavers.features.role.entity.Role;
import com.cengavers.features.role.service.RoleService;
import com.cengavers.features.user.dto.UserDTO;
import com.cengavers.features.user.dto.request.CreateUserRequest;
import com.cengavers.features.user.entity.User;
import com.cengavers.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${auth.default-role}")
    private String defaultRoleName;

    @Value("${security.jwt.expiry-ms:3600000}")
    private long expiryMs;

    @Override
    public signUpDTO signUp(signUpRequest request) {
        if (userService.existByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        System.out.println("request: " + request);
        System.out.println("request: " + request.getEmail());
        System.out.println("request: " + request.getEmail());
        Role role = roleService.findByRoleName(defaultRoleName);

        CreateUserRequest createUserReq = new CreateUserRequest();
        createUserReq.setUsername(request.getUsername());
        createUserReq.setEmail(request.getEmail());
        createUserReq.setPassword(request.getPassword());
        userService.save(createUserReq);
        UserDTO saved = userService.findByUsername(request.getUsername());

        return signUpDTO.builder()
                .id(saved.getId())
                .user(saved)
                .build();
    }

    @Override
    public signInDTO signIn(signInRequest request) {
        User user = userService.findByUsernameReturnUser(request.getUsername());
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }


        String token = jwtService.generate(user.getUsername());

        return signInDTO.builder()
                .user(userService.findByUsername(request.getUsername()))
                .id(user.getId())
                .token(token)
                .expiresIn(expiryMs)
                .build();

    }
}
