import { z } from "zod";

export type AnnouncementStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const createAnnouncementSchema = z.object({
    title: z.string().min(1, "Başlık gereklidir").max(200, "Başlık en fazla 200 karakter olabilir"),
    description: z.string().min(1, "Açıklama gereklidir").max(2000, "Açıklama en fazla 2000 karakter olabilir"),
    detailsMarkdown: z.string().optional(),
    imageUrl: z.string().max(500, "Resim URL'si en fazla 500 karakter olabilir").optional(),
    clubId: z.number().int().positive().optional(), // Admin duyurusu için opsiyonel
    eventId: z.number().int().positive().optional(),
});

export const updateAnnouncementSchema = z.object({
    title: z.string().max(200, "Başlık en fazla 200 karakter olabilir").optional(),
    description: z.string().max(2000, "Açıklama en fazla 2000 karakter olabilir").optional(),
    detailsMarkdown: z.string().optional(),
    imageUrl: z.string().max(500, "Resim URL'si en fazla 500 karakter olabilir").optional(),
    isActive: z.boolean().optional(),
    eventId: z.number().int().positive().optional(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;

export type AnnouncementDTO = {
    id: number;
    title: string;
    description: string;
    detailsMarkdown?: string;
    imageUrl?: string;
    approvalStatus: AnnouncementStatus;
    isActive: boolean;
    clubId?: number;
    clubName?: string;
    eventId?: number;
    eventTitle?: string;
    createdByUsername: string;
    createdAt: string;
    updatedAt?: string;
};

