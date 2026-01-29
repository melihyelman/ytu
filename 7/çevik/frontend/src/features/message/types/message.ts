import {z} from "zod";

export const createMessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    status: z.boolean(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateMessageRequest = CreateMessageInput;

export type MessageDTO = {
    id:number;
    content: string,
    status: boolean,
}