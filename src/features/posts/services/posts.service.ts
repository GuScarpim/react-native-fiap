import axios from 'axios';
import { Post, PaginatedResponse } from '../types/post.types';
const BASE_URL = 'https://jsonplaceholder.typicode.com';
const TOTAL_POSTS = 100;
export async function fetchPosts(page: number, limit = 10): Promise<PaginatedResponse<Post>> {
    const { data } = await axios.get<Post[]>(`${BASE_URL}/posts`, {
        params: { _page: page, _limit: limit },
    });
    return {
        data,
        page,
        limit,
        hasMore: page * limit < TOTAL_POSTS,
    };
}
export async function fetchPostById(id: number): Promise<Post> {
    const { data } = await axios.get<Post>(`${BASE_URL}/posts/${id}`);
    return data;
}
