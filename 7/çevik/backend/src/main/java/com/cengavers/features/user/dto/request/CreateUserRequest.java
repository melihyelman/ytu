package com.cengavers.features.user.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest extends BaseUserRequest {
    private String username;
    private String email;
    private String password;


}
