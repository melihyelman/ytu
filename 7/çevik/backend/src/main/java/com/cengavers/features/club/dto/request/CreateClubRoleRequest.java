package com.cengavers.features.club.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CreateClubRoleRequest {
    private String name;
    private Long clubId;
    
    @JsonProperty("isAdmin")
    private boolean isAdmin;
}

