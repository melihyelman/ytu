package com.cengavers.features.auth.dto;

import com.cengavers.features.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
public class signUpDTO {
    private Long id;
    private UserDTO user;
}
