package com.cengavers.features.announcement.dto;

import com.cengavers.features.announcement.entity.AnnouncementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementDTO {
    private Long id;
    private String title;
    private String description;
    private String detailsMarkdown;
    private String imageUrl;
    private AnnouncementStatus approvalStatus;
    private Boolean isActive;
    private Long clubId;
    private String clubName;
    private Long eventId;
    private String eventTitle;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

