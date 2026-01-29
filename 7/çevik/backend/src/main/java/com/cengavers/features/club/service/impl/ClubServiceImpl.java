package com.cengavers.features.club.service.impl;

import com.cengavers.features.club.dto.request.CreateClubRequest;
import com.cengavers.features.club.dto.request.CreateClubRoleRequest;
import com.cengavers.features.club.dto.response.ClubMemberResponse;
import com.cengavers.features.club.dto.response.ClubResponse;
import com.cengavers.features.club.dto.response.ClubRoleResponse;
import com.cengavers.features.club.entity.*;
import com.cengavers.features.club.repository.ClubMemberRepository;
import com.cengavers.features.club.repository.ClubRepository;
import com.cengavers.features.club.repository.ClubRoleRepository;
import com.cengavers.features.club.service.ClubService;
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
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubRoleRepository clubRoleRepository;
    private final UserService userService;

    private User getCurrentUserEntity() {
        UserDTO currentUserDto = userService.getCurrentUser();
        return userService.findByUsernameReturnUser(currentUserDto.getUsername());
    }

    @Override
    @Transactional
    public ClubResponse createClub(CreateClubRequest request) {
        if (clubRepository.existsByName(request.getName())) {
            throw new RuntimeException("Club name already exists");
        }
        User currentUser = getCurrentUserEntity();
        Club club = new Club();
        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setOwner(currentUser);
        club.setStatus(ClubStatus.PENDING);
        Club saved = clubRepository.save(club);
        return mapToClubResponse(saved);
    }

    @Override
    @Transactional
    public ClubResponse approveClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        club.setStatus(ClubStatus.APPROVED);

        // Create default admin role for the club
        ClubRole adminRole = new ClubRole();
        adminRole.setName("Kurucu");
        adminRole.setAdmin(true);
        adminRole.setClub(club);
        clubRoleRepository.save(adminRole);

        // Assign owner as admin member
        ClubMember member = new ClubMember();
        member.setClub(club);
        member.setUser(club.getOwner());
        member.setStatus(MembershipStatus.APPROVED);
        member.setRole(adminRole);
        clubMemberRepository.save(member);

        return mapToClubResponse(clubRepository.save(club));
    }

    @Override
    public void rejectClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        club.setStatus(ClubStatus.REJECTED);
        clubRepository.save(club);
    }

    @Override
    public ClubResponse getClubById(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        return mapToClubResponse(club);
    }

    @Override
    public List<ClubResponse> getAllClubs() {
        User currentUser = getCurrentUserEntity();

        // Get all memberships of the current user
        java.util.Map<Long, MembershipStatus> membershipMap = clubMemberRepository.findByUserId(currentUser.getId())
                .stream()
                .collect(Collectors.toMap(m -> m.getClub().getId(), ClubMember::getStatus));

        return clubRepository.findAll().stream()
                .map(club -> {
                    ClubResponse response = mapToClubResponse(club);
                    response.setCurrentUserStatus(membershipMap.get(club.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ClubResponse> getPublicClubs() {
        return clubRepository.findAll().stream()
                .filter(c -> c.getStatus() == ClubStatus.APPROVED)
                .map(club -> {
                    return ClubResponse.builder()
                            .id(club.getId())
                            .name(club.getName())
                            .description(club.getDescription())
                            .status(club.getStatus())
                            .ownerUsername(club.getOwner().getUsername())
                            .createdAt(club.getCreatedAt())
                            .memberCount(clubMemberRepository
                                    .findByClubIdAndStatus(club.getId(), MembershipStatus.APPROVED).size())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ClubResponse> getManagedClubs() {
        User currentUser = getCurrentUserEntity();

        // Get all memberships for role checking
        List<ClubMember> myMemberships = clubMemberRepository.findByUserId(currentUser.getId());

        List<Long> managedClubIds = myMemberships.stream()
                .filter(m -> m.getStatus() == MembershipStatus.APPROVED && m.getRole() != null && m.getRole().isAdmin())
                .map(m -> m.getClub().getId())
                .collect(Collectors.toList());

        // Map for status
        java.util.Map<Long, MembershipStatus> membershipMap = myMemberships.stream()
                .collect(Collectors.toMap(m -> m.getClub().getId(), ClubMember::getStatus));

        return clubRepository.findAll().stream()
                .filter(c -> c.getOwner().getId().equals(currentUser.getId()) || managedClubIds.contains(c.getId()))
                .map(club -> {
                    ClubResponse response = mapToClubResponse(club);
                    response.setCurrentUserStatus(membershipMap.get(club.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ClubResponse> getJoinedClubs() {
        User currentUser = getCurrentUserEntity();
        return clubMemberRepository.findByUserId(currentUser.getId()).stream()
                .filter(m -> m.getStatus() == MembershipStatus.APPROVED)
                .map(m -> {
                    ClubResponse response = mapToClubResponse(m.getClub());
                    response.setCurrentUserStatus(MembershipStatus.APPROVED);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void joinClub(Long clubId) {
        User currentUser = getCurrentUserEntity();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        if (club.getStatus() != ClubStatus.APPROVED) {
            throw new RuntimeException("Cannot join a club that is not approved");
        }

        if (clubMemberRepository.findByClubIdAndUserId(clubId, currentUser.getId()).isPresent()) {
            throw new RuntimeException("Already a member or requested");
        }

        ClubMember member = new ClubMember();
        member.setClub(club);
        member.setUser(currentUser);
        member.setStatus(MembershipStatus.PENDING);
        clubMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void approveMembership(Long memberId) {
        ClubMember memberRequest = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member request not found"));

        User currentUser = getCurrentUserEntity();
        checkClubAdminAccess(memberRequest.getClub(), currentUser);

        memberRequest.setStatus(MembershipStatus.APPROVED);
        clubMemberRepository.save(memberRequest);
    }

    @Override
    public void rejectMembership(Long memberId) {
        ClubMember memberRequest = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member request not found"));

        User currentUser = getCurrentUserEntity();
        checkClubAdminAccess(memberRequest.getClub(), currentUser);

        memberRequest.setStatus(MembershipStatus.REJECTED);
        clubMemberRepository.save(memberRequest);
    }

    private void checkClubAdminAccess(Club club, User user) {
        if (club.getOwner().getId().equals(user.getId()))
            return;

        boolean isAdmin = clubMemberRepository.findByClubIdAndUserId(club.getId(), user.getId())
                .map(m -> m.getStatus() == MembershipStatus.APPROVED && m.getRole() != null && m.getRole().isAdmin())
                .orElse(false);

        if (!isAdmin) {
            throw new RuntimeException("Only club owner or admins can perform this action");
        }
    }

    @Override
    public void leaveClub(Long clubId) {
        User currentUser = getCurrentUserEntity();
        ClubMember member = clubMemberRepository.findByClubIdAndUserId(clubId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Not a member"));
        clubMemberRepository.delete(member);
    }

    @Override
    public List<ClubMemberResponse> getClubMembers(Long clubId) {
        return clubMemberRepository.findByClubId(clubId).stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClubRoleResponse createClubRole(CreateClubRoleRequest request) {
        System.out.println("=== Creating Club Role ===");
        System.out.println("Request: name=" + request.getName() + ", clubId=" + request.getClubId() + ", isAdmin="
                + request.isAdmin());

        Club club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        User currentUser = getCurrentUserEntity();
        if (!club.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only club owner can create roles");
        }

        ClubRole role = new ClubRole();
        role.setName(request.getName());
        role.setClub(club);
        role.setAdmin(request.isAdmin());

        ClubRole saved = clubRoleRepository.save(role);
        System.out.println("Saved role: id=" + saved.getId() + ", isAdmin=" + saved.isAdmin());

        return mapToRoleResponse(saved);
    }

    @Override
    public List<ClubRoleResponse> getClubRoles(Long clubId) {
        return clubRoleRepository.findByClubId(clubId).stream()
                .map(this::mapToRoleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignRole(Long memberId, Long roleId) {
        ClubMember member = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        User currentUser = getCurrentUserEntity();
        checkClubAdminAccess(member.getClub(), currentUser);

        ClubRole role = clubRoleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!role.getClub().getId().equals(member.getClub().getId())) {
            throw new RuntimeException("Role does not belong to this club");
        }

        member.setRole(role);
        clubMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void removeMember(Long memberId) {
        ClubMember member = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        User currentUser = getCurrentUserEntity();
        checkClubAdminAccess(member.getClub(), currentUser);

        // Cannot remove the club owner
        if (member.getUser().getId().equals(member.getClub().getOwner().getId())) {
            throw new RuntimeException("Cannot remove the club owner");
        }

        clubMemberRepository.delete(member);
    }

    private ClubResponse mapToClubResponse(Club club) {
        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .status(club.getStatus())
                .ownerUsername(club.getOwner().getUsername())
                .createdAt(club.getCreatedAt())
                .memberCount(clubMemberRepository.findByClubIdAndStatus(club.getId(), MembershipStatus.APPROVED).size())
                .build();
    }

    private ClubMemberResponse mapToMemberResponse(ClubMember member) {
        return ClubMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .username(member.getUser().getUsername())
                .status(member.getStatus())
                .roleName(member.getRole() != null ? member.getRole().getName() : null)
                .joinDate(member.getJoinDate())
                .build();
    }

    private ClubRoleResponse mapToRoleResponse(ClubRole role) {
        return ClubRoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .clubId(role.getClub().getId())
                .build();
    }
}
