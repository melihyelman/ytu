package com.cengavers.features.announcement.service;

import com.cengavers.features.announcement.dto.AnnouncementDTO;
import com.cengavers.features.announcement.dto.CreateAnnouncementRequest;
import com.cengavers.features.announcement.dto.UpdateAnnouncementRequest;

import java.util.List;

public interface AnnouncementService {
    
    AnnouncementDTO create(CreateAnnouncementRequest request);
    
    AnnouncementDTO update(Long id, UpdateAnnouncementRequest request);
    
    AnnouncementDTO findById(Long id);
    
    List<AnnouncementDTO> findAll();
    
    List<AnnouncementDTO> findAllActive();
    
    List<AnnouncementDTO> getPendingAnnouncements();
    
    AnnouncementDTO approveAnnouncement(Long id);
    
    AnnouncementDTO rejectAnnouncement(Long id);
    
    List<AnnouncementDTO> getMyAnnouncements();
    
    List<AnnouncementDTO> getClubAnnouncements(Long clubId);
    
    void deleteById(Long id);
}

