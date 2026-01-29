package com.cengavers.features.club.entity;

import com.cengavers.features.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "CLUB_MEMBERS")
public class ClubMember {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private MembershipStatus status;

    @ManyToOne
    @JoinColumn(name = "club_role_id")
    private ClubRole role;

    private LocalDateTime joinDate = LocalDateTime.now();
}

