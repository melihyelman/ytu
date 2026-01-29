import { http } from "../../../lib/http";
import { AnnouncementDTO, CreateAnnouncementInput, UpdateAnnouncementInput } from "../types/announcement";

export async function findAll(): Promise<AnnouncementDTO[]> {
    const res = await http.get<AnnouncementDTO[]>("/announcements");
    return res.data;
}

export async function findAllActive(): Promise<AnnouncementDTO[]> {
    const res = await http.get<AnnouncementDTO[]>("/announcements/active");
    return res.data;
}

export async function findById(id: number): Promise<AnnouncementDTO> {
    const res = await http.get<AnnouncementDTO>(`/announcements/${id}`);
    return res.data;
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<AnnouncementDTO> {
    const res = await http.post<AnnouncementDTO>("/announcements", input);
    return res.data;
}

export async function updateAnnouncement(id: number, input: UpdateAnnouncementInput): Promise<AnnouncementDTO> {
    const res = await http.put<AnnouncementDTO>(`/announcements/${id}`, input);
    return res.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
    await http.delete<void>(`/announcements/${id}`);
}

export async function getPendingAnnouncements(): Promise<AnnouncementDTO[]> {
    const res = await http.get<AnnouncementDTO[]>("/announcements/pending");
    return res.data;
}

export async function approveAnnouncement(id: number): Promise<AnnouncementDTO> {
    const res = await http.put<AnnouncementDTO>(`/announcements/${id}/approve`);
    return res.data;
}

export async function rejectAnnouncement(id: number): Promise<AnnouncementDTO> {
    const res = await http.put<AnnouncementDTO>(`/announcements/${id}/reject`);
    return res.data;
}

export async function getMyAnnouncements(): Promise<AnnouncementDTO[]> {
    const res = await http.get<AnnouncementDTO[]>("/announcements/my-announcements");
    return res.data;
}

export async function getClubAnnouncements(clubId: number): Promise<AnnouncementDTO[]> {
    const res = await http.get<AnnouncementDTO[]>(`/announcements/club/${clubId}`);
    return res.data;
}

