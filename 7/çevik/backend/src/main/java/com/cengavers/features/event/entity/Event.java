package com.cengavers.features.event.entity;

import com.cengavers.features.club.entity.Club;
import com.cengavers.features.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "EVENTS")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "DESCRIPTION", nullable = false, length = 1000)
    private String description;

    @Column(name = "DETAILS_MARKDOWN", columnDefinition = "TEXT")
    private String detailsMarkdown;

    @Column(name = "EVENT_DATE", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "LOCATION", length = 500)
    private String location;

    @Column(name = "CAPACITY")
    private Integer capacity;

    @Column(name = "IMAGE_URL", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private EventStatus status = EventStatus.PENDING;

    @Column(name = "IS_CLUB_EXCLUSIVE", nullable = false)
    private Boolean isClubExclusive = false;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = EventStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

