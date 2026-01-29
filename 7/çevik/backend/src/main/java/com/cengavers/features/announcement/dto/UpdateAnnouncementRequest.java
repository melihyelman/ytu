package com.cengavers.features.announcement.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAnnouncementRequest {
    
    @Size(max = 200, message = "Başlık en fazla 200 karakter olabilir")
    private String title;
    
    @Size(max = 2000, message = "Açıklama en fazla 2000 karakter olabilir")
    private String description;
    
    private String detailsMarkdown;
    
    @Size(max = 500, message = "Resim URL'si en fazla 500 karakter olabilir")
    private String imageUrl;
    
    private Boolean isActive;
    
    private Long eventId; // Etkinlik ilişkisini güncelleme
}

