import { UserDTO } from "../types/auth";

export const isAdmin = (u?: UserDTO | null) => !!u && Number(u.roleId) === 1;
