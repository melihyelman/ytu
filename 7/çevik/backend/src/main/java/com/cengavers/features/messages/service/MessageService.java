package com.cengavers.features.messages.service;

import com.cengavers.features.messages.dto.MessageDTO;

import java.util.List;

public interface MessageService {

    void save(MessageDTO request);

    void updateById(Long id, MessageDTO request);

    MessageDTO findById(Long id);

    List<MessageDTO> findAll();

    void deleteById(Long id);
}
