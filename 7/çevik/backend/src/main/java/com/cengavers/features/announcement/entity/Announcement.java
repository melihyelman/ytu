package com.cengavers.features.announcement.entity;

import com.cengavers.features.club.entity.Club;
import com.cengavers.features.event.entity.Event;
import com.cengavers.features.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Table(name = "ANNOUNCEMENTS")
@NoArgsConstructor
@Entity
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "DESCRIPTION", nullable = false, length = 2000)
    private String description;

    @Column(name = "DETAILS_MARKDOWN", columnDefinition = "TEXT")
    private String detailsMarkdown;

    @Column(name = "IMAGE_URL", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "APPROVAL_STATUS", nullable = false)
    private AnnouncementStatus approvalStatus = AnnouncementStatus.PENDING;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = true)
    private Club club;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @Transient
    public String getAnnouncementType() {
        if (club == null && event == null) {
            return "ADMIN_ANNOUNCEMENT";
        } else if (club != null && event == null) {
            return "CLUB_ANNOUNCEMENT";
        } else if (club != null && event != null) {
            return "EVENT_ANNOUNCEMENT";
        }
        return "UNKNOWN";
    }

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (approvalStatus == null) {
            approvalStatus = AnnouncementStatus.PENDING;
        }
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

