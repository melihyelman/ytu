package com.cengavers.features.club.repository;

import com.cengavers.features.club.entity.ClubMember;
import com.cengavers.features.club.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByClubId(Long clubId);
    List<ClubMember> findByUserId(Long userId);
    List<ClubMember> findByClubIdAndStatus(Long clubId, MembershipStatus status);
    Optional<ClubMember> findByClubIdAndUserId(Long clubId, Long userId);
}

