import { http } from "../../../lib/http";
import { CreateRoleInput, CreateRoleRequest, RoleDTO } from "../types/role";

export async function findAll(): Promise<RoleDTO[]>{
    const res = await http.get<RoleDTO[]>("/roles")
    return res.data;
}

export async function findById(roleId:number): Promise<RoleDTO> {
    const res = await http.get<RoleDTO>(`/roles/${roleId}`);
    return res.data;
}

export async function createRole(input:CreateRoleRequest): Promise<void> {
    await http.post<void>("/roles",input);
}

export async function deleteRole(roleId:number): Promise<void> {
    await http.delete<void>(`/roles/${roleId}`);
}