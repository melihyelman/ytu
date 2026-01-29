package com.cengavers.features.user.entity;

import com.cengavers.features.role.entity.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "USERS")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    private Long id;

    @Column(name = "USERNAME", unique = true, nullable = false)
    private String username;

    @Column(name = "EMAIL", unique = true, nullable = true)
    private String email;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ROLE_ID")
    private Role role;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "CLASS_YEAR")
    private String classYear;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "AGE")
    private Integer age;

    @Column(name = "HOBBY")
    private String hobby;

    private LocalDateTime createdAt = LocalDateTime.now();

}
