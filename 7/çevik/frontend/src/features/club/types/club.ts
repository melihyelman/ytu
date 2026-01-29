import { z } from "zod";

export type ClubStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type MembershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateClubRequest {
    name: string;
    description: string;
}

export const createClubSchema = z.object({
    name: z.string().min(3, "En az 3 karakter olmalı"),
    description: z.string().min(5, "En az 5 karakter olmalı"),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;


export interface CreateClubRoleRequest {
    name: string;
    clubId: number;
    isAdmin: boolean;
}

export interface ClubResponse {
    id: number;
    name: string;
    description: string;
    status: ClubStatus;
    ownerUsername: string;
    createdAt: string;
    currentUserStatus?: MembershipStatus;
    memberCount: number;
}

export interface ClubMemberResponse {
    id: number;
    userId: number;
    username: string;
    status: MembershipStatus;
    roleName: string;
    joinDate: string;
}

export interface ClubRoleResponse {
    id: number;
    name: string;
    clubId: number;
}
