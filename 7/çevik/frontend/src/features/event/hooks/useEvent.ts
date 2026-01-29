import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/eventApi";
import type { CreateEventInput, UpdateEventInput } from "../types/event";

export const useEvent = () => {
    const queryClient = useQueryClient();

    const createEventMutation = useMutation({
        mutationFn: eventApi.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["myClubEvents"] });
        },
    });

    const updateEventMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateEventInput }) =>
            eventApi.updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["myClubEvents"] });
        },
    });

    const approveEventMutation = useMutation({
        mutationFn: eventApi.approveEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["pendingEvents"] });
        },
    });

    const rejectEventMutation = useMutation({
        mutationFn: eventApi.rejectEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["pendingEvents"] });
        },
    });

    const deleteEventMutation = useMutation({
        mutationFn: eventApi.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["myClubEvents"] });
        },
    });

    const joinEventMutation = useMutation({
        mutationFn: eventApi.joinEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["approvedEvents"] });
            queryClient.invalidateQueries({ queryKey: ["myParticipations"] });
        },
    });

    const leaveEventMutation = useMutation({
        mutationFn: eventApi.leaveEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["approvedEvents"] });
            queryClient.invalidateQueries({ queryKey: ["myParticipations"] });
        },
    });

    return {
        createEvent: (data: CreateEventInput) => createEventMutation.mutateAsync(data),
        updateEvent: (id: number, data: UpdateEventInput) =>
            updateEventMutation.mutateAsync({ id, data }),
        approveEvent: (id: number) => approveEventMutation.mutateAsync(id),
        rejectEvent: (id: number) => rejectEventMutation.mutateAsync(id),
        deleteEvent: (id: number) => deleteEventMutation.mutateAsync(id),
        joinEvent: (id: number) => joinEventMutation.mutateAsync(id),
        leaveEvent: (id: number) => leaveEventMutation.mutateAsync(id),
        isCreating: createEventMutation.isPending,
        isUpdating: updateEventMutation.isPending,
        isApproving: approveEventMutation.isPending,
        isRejecting: rejectEventMutation.isPending,
        isDeleting: deleteEventMutation.isPending,
        isJoining: joinEventMutation.isPending,
        isLeaving: leaveEventMutation.isPending,
    };
};

export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: eventApi.getAllEvents,
    });
};

export const useApprovedEvents = () => {
    return useQuery({
        queryKey: ["approvedEvents"],
        queryFn: eventApi.getApprovedEvents,
    });
};

export const useEventsByClubId = (clubId: number) => {
    return useQuery({
        queryKey: ["events", "club", clubId],
        queryFn: () => eventApi.getEventsByClubId(clubId),
        enabled: !!clubId,
    });
};

export const useMyClubEvents = () => {
    return useQuery({
        queryKey: ["myClubEvents"],
        queryFn: eventApi.getMyClubEvents,
    });
};

export const usePendingEvents = () => {
    return useQuery({
        queryKey: ["pendingEvents"],
        queryFn: eventApi.getPendingEvents,
    });
};

export const useEventById = (id: number) => {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => eventApi.getEventById(id),
        enabled: !!id,
    });
};

export const useMyParticipations = () => {
    return useQuery({
        queryKey: ["myParticipations"],
        queryFn: eventApi.getMyParticipations,
    });
};

export const useEventParticipants = (eventId: number) => {
    return useQuery({
        queryKey: ["events", eventId, "participants"],
        queryFn: () => eventApi.getEventParticipants(eventId),
        enabled: !!eventId,
    });
};

