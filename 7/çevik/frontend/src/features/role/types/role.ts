import {z} from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(2, "Rol en az 2 harf olmalidir"),
    description: z.string().min(2, "Aciklama en az 2 harf olmalidir"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type CreateRoleRequest = CreateRoleInput;

export type RoleDTO = {
    id : number;
    name : string;
    description : string;
}