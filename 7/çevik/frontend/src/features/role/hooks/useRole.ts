import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateRoleRequest, RoleDTO } from "../types/role";
import { createRole, deleteRole, findAll, findById } from "../api/roleApi";


const QK = {
    rolesAll: ["roles"] as const,
    role: (id: number) => ["role",id] as const
};

export function useRoles(){
    return useQuery<RoleDTO[]>({
        queryKey: QK.rolesAll,
        queryFn: findAll,
        staleTime: 60_000,
    });
}

export function useRole(id:number){
    return useQuery<RoleDTO>({
        queryKey: QK.role(id),
        queryFn: ()=> findById(id),
        enabled: !!id,
        staleTime: 60_000
    });
}

export function useCreateRole(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateRoleRequest) => createRole(input),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: QK.rolesAll})
        } 
    })
}

export function useDeleteRole(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteRole(id),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: QK.rolesAll})
        } 
    })
}