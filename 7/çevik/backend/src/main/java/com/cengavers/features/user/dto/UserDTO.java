package com.cengavers.features.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Long roleId;
    private String phone;
    private String department;
    private String classYear;
    private String firstName;
    private String lastName;
    private Integer age;
    private String hobby;
    private LocalDateTime createdAt;
}
