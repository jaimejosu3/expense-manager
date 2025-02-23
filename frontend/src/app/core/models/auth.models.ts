export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    data: {
        access_token: string;
        user: User;
    }
}