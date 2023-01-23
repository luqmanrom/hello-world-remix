import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type {Post} from '@prisma/client';
import { createPost, getPosts } from "~/services/post.server";
import {Post as PostComponent} from 'app/components/Post';
import {PostForm} from 'app/components/PostForm';
import { CreatePost } from "~/services/validation";

type LoaderData = {
  posts: Post[];
}

type ActionData = {
  error?: {
    formError?: string[],
    fieldErrors?: {
      title: string[],
      body: string[]
    },
    fields?: {
      title?: string,
      body?: string
    }
  }


}

// loader will be run on server
export const loader: LoaderFunction = async () => {
  const data : LoaderData = {
    posts: await getPosts()
  }
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const rawTitle = form.get('title');
  const rawBody = form.get('body');

  const result = CreatePost.safeParse({
    title: rawTitle as string,
    body: rawBody as string
  });

  if (!result.success) {
    return json({
      error: result.error.flatten(),
      fields: {
        title: rawTitle,
        body: rawBody
      }
    }, { status: 400 })
  } else {
    createPost({
      title: rawTitle as string,
      body: rawBody as string
    });

    return redirect('/');

  }

}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const {posts} = data;

  const formData = useActionData<ActionData>();
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-3xl">Welcome to Remix !!  </h1>

      <PostForm method='post' action="/?index" error={formData?.error} fields={formData?.fields} />
      <ul>
          {posts.map((post) => (
            <li key={post.title}>
              <PostComponent title={post.title}>
                {post.body}
              </PostComponent>
            
            </li>
          ))}
       
      </ul>
    </div>
  );
}
