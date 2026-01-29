package com.cengavers.features.club.repository;

import com.cengavers.features.club.entity.Club;
import com.cengavers.features.club.entity.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByStatus(ClubStatus status);
    boolean existsByName(String name);
}

