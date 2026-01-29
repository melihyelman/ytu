package com.cengavers.features.role.service;



import com.cengavers.features.role.dto.RoleDTO;
import com.cengavers.features.role.dto.request.CreateRoleRequest;
import com.cengavers.features.role.entity.Role;

import java.util.List;

public interface RoleService {
    void save(CreateRoleRequest request);

    void deleteById(Long id);

    void updateById(Long id, CreateRoleRequest request);

    List<RoleDTO> findAll();

    RoleDTO findById(Long id);

    Role findByRoleName(String name);
}
