package com.cengavers.features.club.controller;

import com.cengavers.features.club.dto.request.CreateClubRequest;
import com.cengavers.features.club.dto.request.CreateClubRoleRequest;
import com.cengavers.features.club.dto.response.ClubMemberResponse;
import com.cengavers.features.club.dto.response.ClubResponse;
import com.cengavers.features.club.dto.response.ClubRoleResponse;
import com.cengavers.features.club.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @PostMapping
    public ResponseEntity<ClubResponse> createClub(@RequestBody CreateClubRequest request) {
        return ResponseEntity.ok(clubService.createClub(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponse> approveClub(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.approveClub(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectClub(@PathVariable Long id) {
        clubService.rejectClub(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponse> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @GetMapping
    public ResponseEntity<List<ClubResponse>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/public")
    public ResponseEntity<List<ClubResponse>> getPublicClubs() {
        return ResponseEntity.ok(clubService.getPublicClubs());
    }

    @GetMapping("/my-managed")
    public ResponseEntity<List<ClubResponse>> getManagedClubs() {
        return ResponseEntity.ok(clubService.getManagedClubs());
    }

    @GetMapping("/my-joined")
    public ResponseEntity<List<ClubResponse>> getJoinedClubs() {
        return ResponseEntity.ok(clubService.getJoinedClubs());
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinClub(@PathVariable Long id) {
        clubService.joinClub(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/member/{id}/approve")
    public ResponseEntity<Void> approveMembership(@PathVariable Long id) {
        clubService.approveMembership(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/member/{id}/reject")
    public ResponseEntity<Void> rejectMembership(@PathVariable Long id) {
        clubService.rejectMembership(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveClub(@PathVariable Long id) {
        clubService.leaveClub(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<ClubMemberResponse>> getClubMembers(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubMembers(id));
    }

    @PostMapping("/role")
    public ResponseEntity<ClubRoleResponse> createClubRole(@RequestBody CreateClubRoleRequest request) {
        return ResponseEntity.ok(clubService.createClubRole(request));
    }

    @GetMapping("/{id}/roles")
    public ResponseEntity<List<ClubRoleResponse>> getClubRoles(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubRoles(id));
    }

    @PostMapping("/member/{memberId}/assign-role/{roleId}")
    public ResponseEntity<Void> assignRole(@PathVariable Long memberId, @PathVariable Long roleId) {
        clubService.assignRole(memberId, roleId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/member/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long memberId) {
        clubService.removeMember(memberId);
        return ResponseEntity.ok().build();
    }
}
