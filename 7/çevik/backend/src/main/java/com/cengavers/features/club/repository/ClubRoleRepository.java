package com.cengavers.features.club.repository;

import com.cengavers.features.club.entity.ClubRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubRoleRepository extends JpaRepository<ClubRole, Long> {
    List<ClubRole> findByClubId(Long clubId);
}

