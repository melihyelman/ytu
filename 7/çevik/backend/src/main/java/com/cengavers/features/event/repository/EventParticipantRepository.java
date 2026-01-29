package com.cengavers.features.event.repository;

import com.cengavers.features.event.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    Optional<EventParticipant> findByEventIdAndUserId(Long eventId, Long userId);
    
    List<EventParticipant> findByEventId(Long eventId);
    
    List<EventParticipant> findByUserId(Long userId);
    
    Long countByEventId(Long eventId);
    
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}




