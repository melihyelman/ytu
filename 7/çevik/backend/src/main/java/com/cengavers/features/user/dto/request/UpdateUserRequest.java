package com.cengavers.features.user.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest extends BaseUserRequest {
    private String username;
    private String email;
    private String password;
    private Long roleId;
    private String phone;
    private String department;
    private String classYear;
    private String firstName;
    private String lastName;
    private Integer age;
    private String hobby;
}
