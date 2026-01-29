package com.cengavers.features.club.dto.response;

import com.cengavers.features.club.entity.MembershipStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClubMemberResponse {
    private Long id;
    private Long userId;
    private String username;
    private MembershipStatus status;
    private String roleName;
    private LocalDateTime joinDate;
}

