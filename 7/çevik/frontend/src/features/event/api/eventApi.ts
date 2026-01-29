import { http } from "@/lib/http";
import type { CreateEventInput, EventParticipant, EventResponse, UpdateEventInput } from "../types/event";

export const eventApi = {
    createEvent: async (data: CreateEventInput): Promise<EventResponse> => {
        const response = await http.post("/events", data);
        return response.data;
    },

    updateEvent: async (id: number, data: UpdateEventInput): Promise<EventResponse> => {
        const response = await http.put(`/events/${id}`, data);
        return response.data;
    },

    getEventById: async (id: number): Promise<EventResponse> => {
        const response = await http.get(`/events/${id}`);
        return response.data;
    },

    getAllEvents: async (): Promise<EventResponse[]> => {
        const response = await http.get("/events");
        return response.data;
    },

    getApprovedEvents: async (): Promise<EventResponse[]> => {
        const response = await http.get("/events/approved");
        return response.data;
    },

    getEventsByClubId: async (clubId: number): Promise<EventResponse[]> => {
        const response = await http.get(`/events/club/${clubId}`);
        return response.data;
    },

    getMyClubEvents: async (): Promise<EventResponse[]> => {
        const response = await http.get("/events/my-club-events");
        return response.data;
    },

    getPendingEvents: async (): Promise<EventResponse[]> => {
        const response = await http.get("/events/pending");
        return response.data;
    },

    approveEvent: async (id: number): Promise<EventResponse> => {
        const response = await http.put(`/events/${id}/approve`);
        return response.data;
    },

    rejectEvent: async (id: number): Promise<EventResponse> => {
        const response = await http.put(`/events/${id}/reject`);
        return response.data;
    },

    deleteEvent: async (id: number): Promise<void> => {
        await http.delete(`/events/${id}`);
    },

    joinEvent: async (id: number): Promise<void> => {
        await http.post(`/events/${id}/join`);
    },

    leaveEvent: async (id: number): Promise<void> => {
        await http.delete(`/events/${id}/leave`);
    },

    getMyParticipations: async (): Promise<EventResponse[]> => {
        const response = await http.get("/events/my-participations");
        return response.data;
    },

    getEventParticipants: async (id: number): Promise<EventParticipant[]> => {
        const response = await http.get(`/events/${id}/participants`);
        return response.data;
    },
};

