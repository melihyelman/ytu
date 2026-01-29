package com.cengavers.features.announcement.controller;

import com.cengavers.features.announcement.dto.AnnouncementDTO;
import com.cengavers.features.announcement.dto.CreateAnnouncementRequest;
import com.cengavers.features.announcement.dto.UpdateAnnouncementRequest;
import com.cengavers.features.announcement.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AnnouncementDTO> create(@Valid @RequestBody CreateAnnouncementRequest request) {
        AnnouncementDTO created = announcementService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> getAll() {
        return ResponseEntity.ok(announcementService.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AnnouncementDTO>> getAllActive() {
        return ResponseEntity.ok(announcementService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> update(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateAnnouncementRequest request) {
        AnnouncementDTO updated = announcementService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AnnouncementDTO>> getPendingAnnouncements() {
        return ResponseEntity.ok(announcementService.getPendingAnnouncements());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AnnouncementDTO> approve(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.approveAnnouncement(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AnnouncementDTO> reject(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.rejectAnnouncement(id));
    }

    @GetMapping("/my-announcements")
    public ResponseEntity<List<AnnouncementDTO>> getMyAnnouncements() {
        return ResponseEntity.ok(announcementService.getMyAnnouncements());
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<AnnouncementDTO>> getClubAnnouncements(@PathVariable Long clubId) {
        return ResponseEntity.ok(announcementService.getClubAnnouncements(clubId));
    }
}

