package com.cengavers.features.auth.dto;


import com.cengavers.features.user.dto.UserDTO;
import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@Builder
@Data
public class signInDTO {
    private Long id;
    private String token;
    private UserDTO user;
    private long expiresIn;
}
