package com.cengavers.features.announcement.dto.converter;

import com.cengavers.features.announcement.dto.AnnouncementDTO;
import com.cengavers.features.announcement.entity.Announcement;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementDTOConverter {
    
    public AnnouncementDTO convert(Announcement announcement) {
        return AnnouncementDTO.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .description(announcement.getDescription())
                .detailsMarkdown(announcement.getDetailsMarkdown())
                .imageUrl(announcement.getImageUrl())
                .approvalStatus(announcement.getApprovalStatus())
                .isActive(announcement.getIsActive())
                .clubId(announcement.getClub() != null ? announcement.getClub().getId() : null)
                .clubName(announcement.getClub() != null ? announcement.getClub().getName() : null)
                .eventId(announcement.getEvent() != null ? announcement.getEvent().getId() : null)
                .eventTitle(announcement.getEvent() != null ? announcement.getEvent().getTitle() : null)
                .createdByUsername(announcement.getCreatedBy().getUsername())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .build();
    }
}

