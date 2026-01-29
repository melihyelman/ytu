package com.cengavers.features.club.service;

import com.cengavers.features.club.dto.request.CreateClubRequest;
import com.cengavers.features.club.dto.request.CreateClubRoleRequest;
import com.cengavers.features.club.dto.response.ClubMemberResponse;
import com.cengavers.features.club.dto.response.ClubResponse;
import com.cengavers.features.club.dto.response.ClubRoleResponse;

import java.util.List;

public interface ClubService {
    ClubResponse createClub(CreateClubRequest request);

    ClubResponse approveClub(Long clubId);

    void rejectClub(Long clubId);

    ClubResponse getClubById(Long clubId);

    List<ClubResponse> getAllClubs();

    List<ClubResponse> getPublicClubs();

    List<ClubResponse> getManagedClubs();

    List<ClubResponse> getJoinedClubs();

    void joinClub(Long clubId);

    void approveMembership(Long memberId);

    void rejectMembership(Long memberId);

    void leaveClub(Long clubId);

    List<ClubMemberResponse> getClubMembers(Long clubId);

    ClubRoleResponse createClubRole(CreateClubRoleRequest request);

    List<ClubRoleResponse> getClubRoles(Long clubId);

    void assignRole(Long memberId, Long roleId);

    void removeMember(Long memberId);
}
