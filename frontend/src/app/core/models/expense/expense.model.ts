import { Category } from "../category/category.model";

export interface Expense {
    id: string;
    amount: number;
    description: string;
    date: Date;
    categoryId: string;
    category?: Category;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
    attachments?: string[];
}