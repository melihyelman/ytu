import { http } from "../../../lib/http";
import { CreateMessageRequest, MessageDTO } from "../types/message";


export async function findAll(): Promise<MessageDTO[]> {
    const res = await http.get<MessageDTO[]>("/messages")
    return res.data;
}

export async function findById(roleId:number): Promise<MessageDTO> {
    const res = await http.get<MessageDTO>(`/messages/${roleId}`);
    return res.data;
}

export async function createMessage(input: CreateMessageRequest): Promise<void> {
    await http.post<void>("/messages",input);
}
export async function deleteMessage(messageId: number): Promise<void> {
    await http.delete<void>(`/messages/${messageId}`);
}
export async function updateMessage(messageId:number,input:CreateMessageRequest): Promise<void> {
    await http.put<void>(`/messages/${messageId}`,input);
    
}