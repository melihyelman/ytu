package com.cengavers.features.event.repository;

import com.cengavers.features.event.entity.Event;
import com.cengavers.features.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByStatus(EventStatus status);
    
    List<Event> findByClubId(Long clubId);
    
    List<Event> findByClubIdAndStatus(Long clubId, EventStatus status);
    
    List<Event> findByCreatedById(Long userId);
}




