import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getUserById, deleteUser, updateUserRole } from "../api/userApi";

export function useAllUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    });
}

export function useUserById(id: number) {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vars: { userId: number; roleId: number }) => updateUserRole(vars.userId, vars.roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

