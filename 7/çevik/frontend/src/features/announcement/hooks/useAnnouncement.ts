import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnnouncementDTO, CreateAnnouncementInput, UpdateAnnouncementInput } from "../types/announcement";
import { 
    createAnnouncement, 
    deleteAnnouncement, 
    findAll, 
    findAllActive, 
    findById, 
    updateAnnouncement,
    getPendingAnnouncements,
    approveAnnouncement,
    rejectAnnouncement,
    getMyAnnouncements,
    getClubAnnouncements
} from "../api/announcementApi";

const QK = {
    announcementsAll: ["announcements"] as const,
    announcementsActive: ["announcements", "active"] as const,
    announcementsPending: ["announcements", "pending"] as const,
    myAnnouncements: ["announcements", "my"] as const,
    clubAnnouncements: (clubId: number) => ["announcements", "club", clubId] as const,
    announcement: (id: number) => ["announcement", id] as const,
};

export function useAnnouncements() {
    return useQuery<AnnouncementDTO[]>({
        queryKey: QK.announcementsAll,
        queryFn: findAll,
        staleTime: 60_000
    });
}

export function useActiveAnnouncements() {
    return useQuery<AnnouncementDTO[]>({
        queryKey: QK.announcementsActive,
        queryFn: findAllActive,
        staleTime: 60_000
    });
}

export function useAnnouncement(id: number) {
    return useQuery<AnnouncementDTO>({
        queryKey: QK.announcement(id),
        queryFn: () => findById(id),
        enabled: !!id,
        staleTime: 60_000
    });
}

export function useCreateAnnouncement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateAnnouncementInput) => createAnnouncement(input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.announcementsAll });
            qc.invalidateQueries({ queryKey: QK.announcementsActive });
        }
    });
}

export function useUpdateAnnouncement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { id: number; input: UpdateAnnouncementInput }) => 
            updateAnnouncement(vars.id, vars.input),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: QK.announcementsAll });
            qc.invalidateQueries({ queryKey: QK.announcementsActive });
            qc.invalidateQueries({ queryKey: QK.announcement(vars.id) });
        }
    });
}

export function useDeleteAnnouncement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAnnouncement(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.announcementsAll });
            qc.invalidateQueries({ queryKey: QK.announcementsActive });
            qc.invalidateQueries({ queryKey: QK.myAnnouncements });
        }
    });
}

export function usePendingAnnouncements() {
    return useQuery<AnnouncementDTO[]>({
        queryKey: QK.announcementsPending,
        queryFn: getPendingAnnouncements,
    });
}

export function useMyAnnouncements() {
    return useQuery<AnnouncementDTO[]>({
        queryKey: QK.myAnnouncements,
        queryFn: getMyAnnouncements,
    });
}

export function useApproveAnnouncement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => approveAnnouncement(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.announcementsAll });
            qc.invalidateQueries({ queryKey: QK.announcementsActive });
            qc.invalidateQueries({ queryKey: QK.announcementsPending });
        }
    });
}

export function useRejectAnnouncement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => rejectAnnouncement(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.announcementsAll });
            qc.invalidateQueries({ queryKey: QK.announcementsPending });
        }
    });
}

export function useClubAnnouncements(clubId: number) {
    return useQuery<AnnouncementDTO[]>({
        queryKey: QK.clubAnnouncements(clubId),
        queryFn: () => getClubAnnouncements(clubId),
        enabled: !!clubId,
        staleTime: 60_000
    });
}

