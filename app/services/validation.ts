import {z} from 'zod';

export const CreatePost = z.object({
    title: z.string().min(10).max(255),
    body: z.string().min(10).max(255)
});