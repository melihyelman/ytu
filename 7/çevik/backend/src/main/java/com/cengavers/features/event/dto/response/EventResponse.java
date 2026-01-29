package com.cengavers.features.event.dto.response;

import com.cengavers.features.event.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String detailsMarkdown;
    private LocalDateTime eventDate;
    private String location;
    private Integer capacity;
    private String imageUrl;
    private EventStatus status;
    private Boolean isClubExclusive;
    private Long clubId;
    private String clubName;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long participantCount;
    private Boolean isParticipating;
}

