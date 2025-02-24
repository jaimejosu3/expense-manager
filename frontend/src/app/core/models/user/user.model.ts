export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    isActive: boolean;
    settings?: UserSettings;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSettings {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
}