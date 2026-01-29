package com.cengavers.features.event.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank(message = "Başlık gereklidir")
    @Size(max = 200, message = "Başlık en fazla 200 karakter olabilir")
    private String title;

    @NotBlank(message = "Açıklama gereklidir")
    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;

    private String detailsMarkdown;

    @NotNull(message = "Etkinlik tarihi gereklidir")
    private LocalDateTime eventDate;

    @Size(max = 500, message = "Lokasyon en fazla 500 karakter olabilir")
    private String location;

    private Integer capacity;

    @Size(max = 500, message = "Resim URL'si en fazla 500 karakter olabilir")
    private String imageUrl;

    @NotNull(message = "Kulüp ID gereklidir")
    private Long clubId;

    private Boolean isClubExclusive = false;
}

