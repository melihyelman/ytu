package com.cengavers.features.club.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClubRoleResponse {
    private Long id;
    private String name;
    private Long clubId;
}

