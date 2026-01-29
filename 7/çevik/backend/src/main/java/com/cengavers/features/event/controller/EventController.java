package com.cengavers.features.event.controller;

import com.cengavers.features.event.dto.request.CreateEventRequest;
import com.cengavers.features.event.dto.request.UpdateEventRequest;
import com.cengavers.features.event.dto.response.EventParticipantResponse;
import com.cengavers.features.event.dto.response.EventResponse;
import com.cengavers.features.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest request) {
        log.info("Creating event: {}", request.getTitle());
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEventRequest request) {
        log.info("Updating event with id: {}", id);
        EventResponse updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<EventResponse>> getApprovedEvents() {
        List<EventResponse> events = eventService.getApprovedEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<EventResponse>> getEventsByClubId(@PathVariable Long clubId) {
        List<EventResponse> events = eventService.getEventsByClubId(clubId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/my-club-events")
    public ResponseEntity<List<EventResponse>> getMyClubEvents() {
        List<EventResponse> events = eventService.getMyClubEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        List<EventResponse> events = eventService.getPendingEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id) {
        log.info("Approving event with id: {}", id);
        EventResponse approved = eventService.approveEvent(id);
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long id) {
        log.info("Rejecting event with id: {}", id);
        EventResponse rejected = eventService.rejectEvent(id);
        return ResponseEntity.ok(rejected);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        log.info("Deleting event with id: {}", id);
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinEvent(@PathVariable Long id) {
        log.info("User joining event with id: {}", id);
        eventService.joinEvent(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveEvent(@PathVariable Long id) {
        log.info("User leaving event with id: {}", id);
        eventService.leaveEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-participations")
    public ResponseEntity<List<EventResponse>> getMyParticipations() {
        List<EventResponse> events = eventService.getMyParticipations();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<EventParticipantResponse>> getEventParticipants(@PathVariable Long id) {
        log.info("Getting participants for event with id: {}", id);
        List<EventParticipantResponse> participants = eventService.getEventParticipants(id);
        return ResponseEntity.ok(participants);
    }
}

