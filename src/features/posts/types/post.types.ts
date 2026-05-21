export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    hasMore: boolean;
}
