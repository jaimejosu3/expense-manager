export interface Category {
    id: string;
    name: string;
    description?: string;
    color: string;
    budget?: number;
    userId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
