package com.cengavers.features.messages.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private String content;
    private Boolean status = false;
}
