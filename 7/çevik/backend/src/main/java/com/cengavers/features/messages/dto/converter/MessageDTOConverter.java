package com.cengavers.features.messages.dto.converter;

import com.cengavers.features.messages.dto.MessageDTO;
import com.cengavers.features.messages.entity.Message;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessageDTOConverter {

    public MessageDTO convert(Message from) {
        return new MessageDTO(
                from.getId(),
                from.getContent(),
                from.getStatus()
        );
    }

    public List<MessageDTO> convert(List<Message> from) {
        return from.stream().map(this::convert).toList();

    }
}
