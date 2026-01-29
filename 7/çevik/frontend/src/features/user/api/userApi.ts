import { http } from "../../../lib/http";
import { User } from "../types/user";

export async function getAllUsers(): Promise<User[]> {
    const res = await http.get<User[]>("/users");
    return res.data;
}

export async function getUserById(id: number): Promise<User> {
    const res = await http.get<User>(`/users/${id}`);
    return res.data;
}

export async function deleteUser(id: number): Promise<void> {
    await http.delete<void>(`/users/${id}`);
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string;
    phone?: string;
    department?: string;
    classYear?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    hobby?: string;
}

export async function updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const res = await http.put<User>(`/users/${id}`, data);
    return res.data;
}

export async function updateUserRole(userId: number, roleId: number): Promise<void> {
    await http.put<void>(`/users/${userId}/role`, { roleId });
}

