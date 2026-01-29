package com.cengavers.features.role.dto.converter;


import com.cengavers.features.role.dto.RoleDTO;
import com.cengavers.features.role.entity.Role;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleDTOConverter {
    public RoleDTO convert (Role from){
        return new RoleDTO(
                from.getId(),
                from.getName(),
                from.getDescription()
        );
    }
    public List<RoleDTO> convert(List<Role> from){
        return from.stream().map(this::convert).toList();

    }

}
