package com.cengavers.features.event.service;

import com.cengavers.features.event.dto.request.CreateEventRequest;
import com.cengavers.features.event.dto.request.UpdateEventRequest;
import com.cengavers.features.event.dto.response.EventParticipantResponse;
import com.cengavers.features.event.dto.response.EventResponse;

import java.util.List;

public interface EventService {
    
    EventResponse createEvent(CreateEventRequest request);
    
    EventResponse updateEvent(Long id, UpdateEventRequest request);
    
    EventResponse getEventById(Long id);
    
    List<EventResponse> getAllEvents();
    
    List<EventResponse> getApprovedEvents();
    
    List<EventResponse> getEventsByClubId(Long clubId);
    
    List<EventResponse> getMyClubEvents();
    
    List<EventResponse> getPendingEvents();
    
    EventResponse approveEvent(Long id);
    
    EventResponse rejectEvent(Long id);
    
    void deleteEvent(Long id);
    
    void joinEvent(Long id);
    
    void leaveEvent(Long id);
    
    List<EventResponse> getMyParticipations();
    
    List<EventParticipantResponse> getEventParticipants(Long eventId);
}

