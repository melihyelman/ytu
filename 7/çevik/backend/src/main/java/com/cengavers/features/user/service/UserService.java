package com.cengavers.features.user.service;

import com.cengavers.features.user.dto.UserDTO;
import com.cengavers.features.user.dto.request.CreateUserRequest;
import com.cengavers.features.user.dto.request.UpdateUserRequest;
import com.cengavers.features.user.entity.User;

import java.util.List;

public interface UserService {

    void saveAdmin(CreateUserRequest request);

    void save(CreateUserRequest request);

    void updateById(Long id, UpdateUserRequest request);

    void deleteById(Long id);

    List<UserDTO> findAll();

    User findByUsernameReturnUser(String username);

    UserDTO findByUserId(Long id);

    UserDTO findByUsername(String username);

    UserDTO getCurrentUser();

    boolean existByUsername(String username);

    void updateUserRole(Long userId, Long roleId);
}
