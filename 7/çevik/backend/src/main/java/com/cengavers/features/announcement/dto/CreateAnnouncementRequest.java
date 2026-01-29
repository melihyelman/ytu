package com.cengavers.features.announcement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAnnouncementRequest {
    
    @NotBlank(message = "Başlık gereklidir")
    @Size(max = 200, message = "Başlık en fazla 200 karakter olabilir")
    private String title;
    
    @NotBlank(message = "Açıklama gereklidir")
    @Size(max = 2000, message = "Açıklama en fazla 2000 karakter olabilir")
    private String description;
    
    private String detailsMarkdown;
    
    @Size(max = 500, message = "Resim URL'si en fazla 500 karakter olabilir")
    private String imageUrl;
    
    private Long clubId; // Opsiyonel - Admin duyurusu için null olabilir
    
    private Long eventId; // Opsiyonel - Etkinlik duyurusu ise
}

