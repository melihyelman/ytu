import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateMessageInput, MessageDTO } from "../types/message"
import { createMessage, deleteMessage, findAll, findById, updateMessage } from "../api/messageApi"


const QK = {
    messagesAll: ["messages"] as const,
    message: (id:number) => ["message",id] as const,
}

export function useMessages(){
    return useQuery<MessageDTO[]>({
        queryKey: QK.messagesAll,
        queryFn: findAll,
        staleTime: 60_000
    })
}

export function useMessage(id:number){
    return useQuery<MessageDTO>({
        queryKey: QK.message(id),
        queryFn: () => findById(id),
        enabled: !!id,
        staleTime: 60_000
    })
}

export function useCreateMessage(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateMessageInput) => createMessage(input),
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({queryKey: QK.messagesAll})
        }
    })
}

export function useDeleteMessage(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMessage(id),
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({queryKey: QK.messagesAll})
        }
    })
}

export function useUpdateMessage(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(vars: {id:number; input: CreateMessageInput;}) => updateMessage(vars.id,vars.input),
        onSuccess:(_d, vars) => {
            qc.invalidateQueries({queryKey: QK.messagesAll})
        }
    })
}