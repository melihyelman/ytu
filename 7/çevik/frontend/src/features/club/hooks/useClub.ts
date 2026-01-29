import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllClubs,
    getJoinedClubs,
    createClub,
    joinClub,
    leaveClub,
    getClubMembers,
    approveMembership,
    rejectMembership,
    approveClub,
    rejectClub,
    getClubRoles,
    createClubRole,
    assignRole,
    getManagedClubs,
    getPublicClubs,
    getClubById,
    removeMember
} from "../api/clubApi";
import { CreateClubRequest, CreateClubRoleRequest } from "../types/club";

const CLUB_KEYS = {
    all: ["clubs"] as const,
    public: ["clubs", "public"] as const,
    myCreated: ["clubs", "my-created"] as const,
    myManaged: ["clubs", "my-managed"] as const,
    myJoined: ["clubs", "my-joined"] as const,
    detail: (id: number) => ["clubs", id] as const,
    members: (id: number) => ["clubs", id, "members"] as const,
    roles: (id: number) => ["clubs", id, "roles"] as const,
};

export function useClubs() {
    return useQuery({
        queryKey: CLUB_KEYS.all,
        queryFn: getAllClubs,
    });
}

export function usePublicClubs() {
    return useQuery({
        queryKey: CLUB_KEYS.public,
        queryFn: getPublicClubs,
    });
}


export function useManagedClubs(enabled: boolean = true) {
    return useQuery({
        queryKey: CLUB_KEYS.myManaged,
        queryFn: getManagedClubs,
        enabled: enabled,
    });
}

export function useJoinedClubs(enabled: boolean = true) {
    return useQuery({
        queryKey: CLUB_KEYS.myJoined,
        queryFn: getJoinedClubs,
        enabled: enabled,
    });
}

export function useClubById(clubId: number) {
    return useQuery({
        queryKey: CLUB_KEYS.detail(clubId),
        queryFn: () => getClubById(clubId),
        enabled: !!clubId,
    });
}

export function useClubMembers(clubId: number) {
    return useQuery({
        queryKey: CLUB_KEYS.members(clubId),
        queryFn: () => getClubMembers(clubId),
        enabled: !!clubId,
    });
}

export function useClubRoles(clubId: number) {
    return useQuery({
        queryKey: CLUB_KEYS.roles(clubId),
        queryFn: () => getClubRoles(clubId),
        enabled: !!clubId,
    });
}

export function useCreateClub() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateClubRequest) => createClub(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.myManaged });
        },
    });
}

export function useJoinClub() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => joinClub(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.myJoined });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
}

export function useLeaveClub() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => leaveClub(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.myJoined });
        },
    });
}

export function useApproveMembership() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => approveMembership(id),
        onSuccess: (_data, _variables, context) => {
            qc.invalidateQueries({ queryKey: ["clubs"] });
        },
    });
}

export function useRejectMembership() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => rejectMembership(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["clubs"] });
        },
    });
}

export function useApproveClub() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => approveClub(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
}

export function useRejectClub() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => rejectClub(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
}

export function useCreateClubRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateClubRoleRequest) => createClubRole(data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.roles(variables.clubId) });
        },
    });
}

export function useAssignRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { memberId: number, roleId: number, clubId: number }) => assignRole(vars.memberId, vars.roleId),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.members(variables.clubId) });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.myManaged });
        },
    });
}

export function useRemoveMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { memberId: number, clubId: number }) => removeMember(vars.memberId),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: CLUB_KEYS.members(variables.clubId) });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.myManaged });
            qc.invalidateQueries({ queryKey: CLUB_KEYS.all });
        },
    });
}
