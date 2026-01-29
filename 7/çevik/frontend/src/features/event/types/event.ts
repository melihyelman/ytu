import { z } from "zod";

export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const createEventSchema = z.object({
    title: z.string().min(1, "Başlık gereklidir").max(200, "Başlık en fazla 200 karakter olabilir"),
    description: z.string().min(1, "Açıklama gereklidir").max(1000, "Açıklama en fazla 1000 karakter olabilir"),
    detailsMarkdown: z.string().optional(),
    eventDate: z.string().min(1, "Etkinlik tarihi gereklidir"),
    location: z.string().max(500, "Lokasyon en fazla 500 karakter olabilir").optional(),
    capacity: z.number().int().positive().optional(),
    imageUrl: z.string().max(500, "Resim URL'si en fazla 500 karakter olabilir").optional(),
    clubId: z.number().int().positive({ message: "Kulüp seçilmelidir" }),
    isClubExclusive: z.boolean().optional(),
});

export const updateEventSchema = z.object({
    title: z.string().max(200, "Başlık en fazla 200 karakter olabilir").optional(),
    description: z.string().max(1000, "Açıklama en fazla 1000 karakter olabilir").optional(),
    detailsMarkdown: z.string().optional(),
    eventDate: z.string().optional(),
    location: z.string().max(500, "Lokasyon en fazla 500 karakter olabilir").optional(),
    capacity: z.number().int().positive().optional(),
    imageUrl: z.string().max(500, "Resim URL'si en fazla 500 karakter olabilir").optional(),
    isClubExclusive: z.boolean().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export interface EventResponse {
    id: number;
    title: string;
    description: string;
    detailsMarkdown?: string;
    eventDate: string;
    location?: string;
    capacity?: number;
    imageUrl?: string;
    status: EventStatus;
    isClubExclusive?: boolean;
    clubId: number;
    clubName: string;
    createdByUsername: string;
    createdAt: string;
    updatedAt?: string;
    participantCount?: number;
    isParticipating?: boolean;
}

export interface EventParticipant {
    id: number;
    userId: number;
    username: string;
    email: string;
    joinedAt: string;
}

