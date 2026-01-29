package com.cengavers.features.role.service.Impl;


import com.cengavers.features.role.dto.RoleDTO;
import com.cengavers.features.role.dto.converter.RoleDTOConverter;
import com.cengavers.features.role.dto.request.CreateRoleRequest;
import com.cengavers.features.role.entity.Role;
import com.cengavers.features.role.repository.RoleRepository;
import com.cengavers.features.role.service.RoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleDTOConverter roleDTOConverter;


    @Override
    @Transactional
    public void save(CreateRoleRequest request) {
        Role role = new Role();
        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException( "Role already exists: " + request.getName());
        }
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        roleRepository.save(role);
    }

    @Override
    public void deleteById(Long id) {
        Optional<Role> role = roleRepository.findById(id);
        Role theRole = role.orElseThrow(()-> new RuntimeException("Role not found with id = " + id));
        roleRepository.delete(theRole);
    }

    @Override
    public void updateById(Long id, CreateRoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Role not found with id = " + id));
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        roleRepository.save(role);
    }

    @Override
    public List<RoleDTO> findAll() {
        return roleDTOConverter.convert(roleRepository.findAll());
    }

    @Override
    public RoleDTO findById(Long id) {
        return roleDTOConverter.convert(
                roleRepository.findById(id)
                        .orElseThrow(
                                ()-> new RuntimeException("Role not found with id = " + id)));
    }



    @Override
    public Role findByRoleName(String name) {
        return roleRepository.findByName(name).orElseThrow(()-> new RuntimeException("Role not found with name = " + name));
    }
}
