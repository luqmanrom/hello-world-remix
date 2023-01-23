import { Post } from '@prisma/client';
import {db} from './db.server';

export type {Post} from '@prisma/client';

export const getPosts = async () => {
    return await db.post.findMany();
}

export const createPost = async ({title, body} : Pick<Post, 'title' | 'body'>) => {
    return await db.post.create({
        data: {
            title,
            body
        }
    });
}
