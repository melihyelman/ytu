package com.cengavers.features.event.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateEventRequest {

    @Size(max = 200, message = "Başlık en fazla 200 karakter olabilir")
    private String title;

    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;

    private String detailsMarkdown;

    private LocalDateTime eventDate;

    @Size(max = 500, message = "Lokasyon en fazla 500 karakter olabilir")
    private String location;

    private Integer capacity;

    @Size(max = 500, message = "Resim URL'si en fazla 500 karakter olabilir")
    private String imageUrl;

    private Boolean isClubExclusive;
}

