export interface CreateExpenseRequest {
    amount: number;
    description: string;
    date: Date;
    categoryId: string;
    notes?: string;
    attachments?: string[];
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> { }

export interface ExpenseFilters {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}