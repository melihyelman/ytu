package com.cengavers.features.club.dto.response;

import com.cengavers.features.club.entity.ClubStatus;
import com.cengavers.features.club.entity.MembershipStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClubResponse {
    private Long id;
    private String name;
    private String description;
    private ClubStatus status;
    private String ownerUsername;
    private LocalDateTime createdAt;
    private MembershipStatus currentUserStatus;
    private long memberCount;
}

