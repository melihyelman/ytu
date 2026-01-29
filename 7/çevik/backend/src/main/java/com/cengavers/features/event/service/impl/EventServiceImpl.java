package com.cengavers.features.event.service.impl;

import com.cengavers.features.club.entity.Club;
import com.cengavers.features.club.entity.ClubMember;
import com.cengavers.features.club.entity.MembershipStatus;
import com.cengavers.features.club.repository.ClubMemberRepository;
import com.cengavers.features.club.repository.ClubRepository;
import com.cengavers.features.event.dto.converter.EventConverter;
import com.cengavers.features.event.dto.request.CreateEventRequest;
import com.cengavers.features.event.dto.request.UpdateEventRequest;
import com.cengavers.features.event.dto.response.EventParticipantResponse;
import com.cengavers.features.event.dto.response.EventResponse;
import com.cengavers.features.event.entity.Event;
import com.cengavers.features.event.entity.EventParticipant;
import com.cengavers.features.event.entity.EventStatus;
import com.cengavers.features.event.repository.EventParticipantRepository;
import com.cengavers.features.event.repository.EventRepository;
import com.cengavers.features.event.service.EventService;
import com.cengavers.features.user.dto.UserDTO;
import com.cengavers.features.user.entity.User;
import com.cengavers.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final UserService userService;
    private final EventConverter eventConverter;

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
        
        // Kulüp yetkilisi mi kontrol et (role tablosunda isAdmin=true olan member)
        ClubMember member = clubMemberRepository.findByClubIdAndUserId(clubId, user.getId())
                .orElse(null);
        
        if (member != null && member.getStatus() == MembershipStatus.APPROVED) {
            return member.getRole() != null && member.getRole().isAdmin();
        }
        
        return false;
    }

    private boolean isClubMember(Long clubId, User user) {
        ClubMember member = clubMemberRepository.findByClubIdAndUserId(clubId, user.getId())
                .orElse(null);
        return member != null && member.getStatus() == MembershipStatus.APPROVED;
    }

    private EventResponse toResponseWithParticipantInfo(Event event, User currentUser) {
        Long participantCount = eventParticipantRepository.countByEventId(event.getId());
        Boolean isParticipating = eventParticipantRepository.existsByEventIdAndUserId(event.getId(), currentUser.getId());
        return eventConverter.toResponse(event, participantCount, isParticipating);
    }

    @Override
    @Transactional
    public EventResponse createEvent(CreateEventRequest request) {
        User currentUser = getCurrentUserEntity();
        
        // Kulüp yetkisi kontrolü
        if (!isClubAuthorizedUser(request.getClubId(), currentUser)) {
            throw new RuntimeException("Bu kulüp için etkinlik oluşturma yetkiniz yok");
        }
        
        Club club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new RuntimeException("Kulüp bulunamadı"));
        
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDetailsMarkdown(request.getDetailsMarkdown());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCapacity(request.getCapacity());
        event.setImageUrl(request.getImageUrl());
        event.setIsClubExclusive(request.getIsClubExclusive() != null ? request.getIsClubExclusive() : false);
        event.setClub(club);
        event.setCreatedBy(currentUser);
        event.setStatus(EventStatus.PENDING);
        
        Event saved = eventRepository.save(event);
        return eventConverter.toResponse(saved);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(Long id, UpdateEventRequest request) {
        User currentUser = getCurrentUserEntity();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        
        // Kulüp yetkisi kontrolü
        if (!isClubAuthorizedUser(event.getClub().getId(), currentUser)) {
            throw new RuntimeException("Bu etkinliği güncelleme yetkiniz yok");
        }
        
        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getDetailsMarkdown() != null) {
            event.setDetailsMarkdown(request.getDetailsMarkdown());
        }
        if (request.getEventDate() != null) {
            event.setEventDate(request.getEventDate());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getCapacity() != null) {
            event.setCapacity(request.getCapacity());
        }
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }
        if (request.getIsClubExclusive() != null) {
            event.setIsClubExclusive(request.getIsClubExclusive());
        }
        
        Event updated = eventRepository.save(event);
        return eventConverter.toResponse(updated);
    }

    @Override
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        User currentUser = getCurrentUserEntity();
        return toResponseWithParticipantInfo(event, currentUser);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        User currentUser = getCurrentUserEntity();
        return eventRepository.findAll().stream()
                .map(event -> toResponseWithParticipantInfo(event, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getApprovedEvents() {
        User currentUser = getCurrentUserEntity();
        return eventRepository.findByStatus(EventStatus.APPROVED).stream()
                .filter(event -> !event.getIsClubExclusive() || isClubMember(event.getClub().getId(), currentUser))
                .map(event -> toResponseWithParticipantInfo(event, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getEventsByClubId(Long clubId) {
        User currentUser = getCurrentUserEntity();
        return eventRepository.findByClubIdAndStatus(clubId, EventStatus.APPROVED).stream()
                .filter(event -> !event.getIsClubExclusive() || isClubMember(clubId, currentUser))
                .map(event -> toResponseWithParticipantInfo(event, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getMyClubEvents() {
        User currentUser = getCurrentUserEntity();
        return eventRepository.findByCreatedById(currentUser.getId()).stream()
                .map(event -> toResponseWithParticipantInfo(event, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getPendingEvents() {
        User currentUser = getCurrentUserEntity();
        return eventRepository.findByStatus(EventStatus.PENDING).stream()
                .map(event -> toResponseWithParticipantInfo(event, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse approveEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        
        event.setStatus(EventStatus.APPROVED);
        Event updated = eventRepository.save(event);
        return eventConverter.toResponse(updated);
    }

    @Override
    @Transactional
    public EventResponse rejectEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        
        event.setStatus(EventStatus.REJECTED);
        Event updated = eventRepository.save(event);
        return eventConverter.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        User currentUser = getCurrentUserEntity();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        
        // Kulüp yetkisi kontrolü
        if (!isClubAuthorizedUser(event.getClub().getId(), currentUser)) {
            throw new RuntimeException("Bu etkinliği silme yetkiniz yok");
        }
        
        eventRepository.delete(event);
    }

    @Override
    @Transactional
    public void joinEvent(Long id) {
        User currentUser = getCurrentUserEntity();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));
        
        // Etkinlik onaylı mı kontrol et
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Bu etkinliğe katılamazsınız");
        }
        
        // Kulübe özel ise kulüp üyesi mi kontrol et
        if (event.getIsClubExclusive() && !isClubMember(event.getClub().getId(), currentUser)) {
            throw new RuntimeException("Bu etkinlik sadece kulüp üyelerine açıktır");
        }
        
        // Zaten katılmış mı kontrol et
        if (eventParticipantRepository.existsByEventIdAndUserId(id, currentUser.getId())) {
            throw new RuntimeException("Zaten bu etkinliğe katıldınız");
        }
        
        // Kapasite kontrolü
        if (event.getCapacity() != null) {
            Long currentCount = eventParticipantRepository.countByEventId(id);
            if (currentCount >= event.getCapacity()) {
                throw new RuntimeException("Etkinlik kapasitesi dolmuştur");
            }
        }
        
        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(currentUser);
        eventParticipantRepository.save(participant);
    }

    @Override
    @Transactional
    public void leaveEvent(Long id) {
        User currentUser = getCurrentUserEntity();
        EventParticipant participant = eventParticipantRepository
                .findByEventIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Bu etkinliğe katılmadınız"));
        
        eventParticipantRepository.delete(participant);
    }

    @Override
    public List<EventResponse> getMyParticipations() {
        User currentUser = getCurrentUserEntity();
        List<EventParticipant> participants = eventParticipantRepository.findByUserId(currentUser.getId());
        
        return participants.stream()
                .map(p -> toResponseWithParticipantInfo(p.getEvent(), currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventParticipantResponse> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        List<EventParticipant> participants = eventParticipantRepository.findByEventId(eventId);
        
        return participants.stream()
                .map(p -> EventParticipantResponse.builder()
                        .id(p.getId())
                        .userId(p.getUser().getId())
                        .username(p.getUser().getUsername())
                        .email(p.getUser().getEmail())
                        .joinedAt(p.getJoinedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

