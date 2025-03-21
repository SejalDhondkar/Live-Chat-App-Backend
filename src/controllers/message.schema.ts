import { z } from "zod";

export const messageSchema = z.object({
    senderId: z.string(),
    recipientId: z.string(),
    message: z.string(),
    iv: z.string(),
    isRead: z.boolean().optional()
}); 