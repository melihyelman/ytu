package com.cengavers.product.config;

import com.cengavers.features.role.entity.Role;
import com.cengavers.features.role.repository.RoleRepository;
import com.cengavers.features.user.entity.User;
import com.cengavers.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsers() {
        return args -> userRepository.findByUsername("admin").orElseGet(() -> {
            var adminRole = roleRepository.findByName("admin").orElseGet(() -> {
                Role r = new Role();
                r.setName("admin");
                r.setDescription("admin user");
                return roleRepository.save(r);
            });

            var adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@cengavers.com");
            adminUser.setPassword(passwordEncoder.encode("cengavers123."));
            adminUser.setRole(adminRole);
            return userRepository.save(adminUser);
        });
    }

    @Bean
    CommandLineRunner seedBaseRole() {
        return args-> roleRepository.findByName("user").orElseGet(() -> {
            Role r = new Role();
            r.setName("user");
            r.setDescription("base user");
            return roleRepository.save(r);
        });
    }
}
