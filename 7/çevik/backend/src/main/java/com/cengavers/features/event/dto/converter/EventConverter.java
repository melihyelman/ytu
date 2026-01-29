package com.cengavers.features.event.dto.converter;

import com.cengavers.features.event.dto.response.EventResponse;
import com.cengavers.features.event.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventConverter {

    public EventResponse toResponse(Event event) {
        return toResponse(event, 0L, false);
    }

    public EventResponse toResponse(Event event, Long participantCount, Boolean isParticipating) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .detailsMarkdown(event.getDetailsMarkdown())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .capacity(event.getCapacity())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .isClubExclusive(event.getIsClubExclusive())
                .clubId(event.getClub().getId())
                .clubName(event.getClub().getName())
                .createdByUsername(event.getCreatedBy().getUsername())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .participantCount(participantCount)
                .isParticipating(isParticipating)
                .build();
    }
}

