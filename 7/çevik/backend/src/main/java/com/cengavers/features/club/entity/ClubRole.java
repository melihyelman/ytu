package com.cengavers.features.club.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "CLUB_ROLES")
public class ClubRole {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_admin", columnDefinition = "boolean default false")
    private boolean isAdmin = false;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
}

