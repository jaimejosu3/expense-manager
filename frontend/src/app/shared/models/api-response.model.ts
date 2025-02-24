export interface ApiResponse<T> {
    data: T;
    message?: string;
    errors?: string[];
}

export interface ErrorResponse {
    message: string;
    errors?: string[];
    statusCode?: number;
}
