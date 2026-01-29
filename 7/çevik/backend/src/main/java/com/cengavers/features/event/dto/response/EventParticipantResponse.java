package com.cengavers.features.event.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private LocalDateTime joinedAt;
}
