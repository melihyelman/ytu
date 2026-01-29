package com.cengavers.features.announcement.service.Impl;

import com.cengavers.features.announcement.dto.AnnouncementDTO;
import com.cengavers.features.announcement.dto.CreateAnnouncementRequest;
import com.cengavers.features.announcement.dto.UpdateAnnouncementRequest;
import com.cengavers.features.announcement.dto.converter.AnnouncementDTOConverter;
import com.cengavers.features.announcement.entity.Announcement;
import com.cengavers.features.announcement.entity.AnnouncementStatus;
import com.cengavers.features.announcement.repository.AnnouncementRepository;
import com.cengavers.features.announcement.service.AnnouncementService;
import com.cengavers.features.club.entity.Club;
import com.cengavers.features.club.entity.ClubMember;
import com.cengavers.features.club.entity.MembershipStatus;
import com.cengavers.features.club.repository.ClubMemberRepository;
import com.cengavers.features.club.repository.ClubRepository;
import com.cengavers.features.event.entity.Event;
import com.cengavers.features.event.repository.EventRepository;
import com.cengavers.features.user.dto.UserDTO;
import com.cengavers.features.user.entity.User;
import com.cengavers.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementDTOConverter announcementDTOConverter;
    private final ClubRepository clubRepository;
    private final EventRepository eventRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final UserService userService;

    private User getCurrentUserEntity() {
        UserDTO currentUserDto = userService.getCurrentUser();
        return userService.findByUsernameReturnUser(currentUserDto.getUsername());
    }

    private boolean isClubAuthorizedUser(Long clubId, User user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Kulüp bulunamadı"));
        
        // Kulüp sahibi mi kontrol et
        if (club.getOwner().getId().equals(user.getId())) {
            return true;
        }
        
        // Kulüp yetkilisi mi kontrol et
        ClubMember member = clubMemberRepository.findByClubIdAndUserId(clubId, user.getId())
                .orElse(null);
        
        if (member != null && member.getStatus() == MembershipStatus.APPROVED) {
            return member.getRole() != null && member.getRole().isAdmin();
        }
        
        return false;
    }

    @Override
    @Transactional
    public AnnouncementDTO create(CreateAnnouncementRequest request) {
        User currentUser = getCurrentUserEntity();
        
        Club club = null;
        Event event = null;
        
        // Kulüp duyurusu veya etkinlik duyurusu ise
        if (request.getClubId() != null) {
            // Kulüp yetkisi kontrolü
            if (!isClubAuthorizedUser(request.getClubId(), currentUser)) {
                throw new RuntimeException("Bu kulüp için duyuru oluşturma yetkiniz yok");
            }
            
            club = clubRepository.findById(request.getClubId())
                    .orElseThrow(() -> new RuntimeException("Kulüp bulunamadı"));
            
            // Etkinlik duyurusu ise
            if (request.getEventId() != null) {
                event = eventRepository.findById(request.getEventId())
                        .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
                
                // Etkinlik bu kulübe ait mi kontrol et
                if (!event.getClub().getId().equals(club.getId())) {
                    throw new RuntimeException("Etkinlik bu kulübe ait değil");
                }
            }
        }
        // Admin duyurusu ise (clubId null) - Admin yetkisi kontrolü yapılacak
        
        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setDescription(request.getDescription());
        announcement.setDetailsMarkdown(request.getDetailsMarkdown());
        announcement.setImageUrl(request.getImageUrl());
        announcement.setClub(club);
        announcement.setEvent(event);
        announcement.setCreatedBy(currentUser);
        announcement.setApprovalStatus(AnnouncementStatus.PENDING);
        announcement.setIsActive(true);
        
        Announcement saved = announcementRepository.save(announcement);
        return announcementDTOConverter.convert(saved);
    }

    @Override
    @Transactional
    public AnnouncementDTO update(Long id, UpdateAnnouncementRequest request) {
        User currentUser = getCurrentUserEntity();
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı"));
        
        // Kulüp yetkisi kontrolü
        if (!isClubAuthorizedUser(announcement.getClub().getId(), currentUser)) {
            throw new RuntimeException("Bu duyuruyu güncelleme yetkiniz yok");
        }
        
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            announcement.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            announcement.setDescription(request.getDescription());
        }
        if (request.getDetailsMarkdown() != null) {
            announcement.setDetailsMarkdown(request.getDetailsMarkdown());
        }
        if (request.getImageUrl() != null) {
            announcement.setImageUrl(request.getImageUrl());
        }
        if (request.getIsActive() != null) {
            announcement.setIsActive(request.getIsActive());
        }
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
            announcement.setEvent(event);
        }
        
        Announcement updated = announcementRepository.save(announcement);
        return announcementDTOConverter.convert(updated);
    }

    @Override
    public AnnouncementDTO findById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı"));
        return announcementDTOConverter.convert(announcement);
    }

    @Override
    public List<AnnouncementDTO> findAll() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(announcementDTOConverter::convert)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementDTO> findAllActive() {
        return announcementRepository.findByApprovalStatusAndIsActiveTrueOrderByCreatedAtDesc(AnnouncementStatus.APPROVED)
                .stream()
                .map(announcementDTOConverter::convert)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<AnnouncementDTO> getPendingAnnouncements() {
        return announcementRepository.findByApprovalStatusOrderByCreatedAtDesc(AnnouncementStatus.PENDING)
                .stream()
                .map(announcementDTOConverter::convert)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    @Transactional
    public AnnouncementDTO approveAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı"));
        
        announcement.setApprovalStatus(AnnouncementStatus.APPROVED);
        Announcement updated = announcementRepository.save(announcement);
        return announcementDTOConverter.convert(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    @Transactional
    public AnnouncementDTO rejectAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı"));
        
        announcement.setApprovalStatus(AnnouncementStatus.REJECTED);
        Announcement updated = announcementRepository.save(announcement);
        return announcementDTOConverter.convert(updated);
    }

    @Override
    public List<AnnouncementDTO> getMyAnnouncements() {
        User currentUser = getCurrentUserEntity();
        return announcementRepository.findByCreatedByIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(announcementDTOConverter::convert)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementDTO> getClubAnnouncements(Long clubId) {
        // Kulübün onaylı ve aktif duyurularını getir
        return announcementRepository.findByClubIdAndApprovalStatusAndIsActiveTrueOrderByCreatedAtDesc(
                clubId, AnnouncementStatus.APPROVED)
                .stream()
                .map(announcementDTOConverter::convert)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User currentUser = getCurrentUserEntity();
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı"));
        
        // Kulüp yetkisi kontrolü
        if (!isClubAuthorizedUser(announcement.getClub().getId(), currentUser)) {
            throw new RuntimeException("Bu duyuruyu silme yetkiniz yok");
        }
        
        announcementRepository.delete(announcement);
    }
}
