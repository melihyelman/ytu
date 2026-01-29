package com.cengavers.features.announcement.repository;

import com.cengavers.features.announcement.entity.Announcement;
import com.cengavers.features.announcement.entity.AnnouncementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
    
    List<Announcement> findByApprovalStatusAndIsActiveTrueOrderByCreatedAtDesc(AnnouncementStatus status);
    
    List<Announcement> findByApprovalStatusOrderByCreatedAtDesc(AnnouncementStatus status);
    
    List<Announcement> findByClubIdOrderByCreatedAtDesc(Long clubId);
    
    List<Announcement> findByClubIdAndApprovalStatusAndIsActiveTrueOrderByCreatedAtDesc(Long clubId, AnnouncementStatus status);
    
    List<Announcement> findByEventIdOrderByCreatedAtDesc(Long eventId);
    
    List<Announcement> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
}

