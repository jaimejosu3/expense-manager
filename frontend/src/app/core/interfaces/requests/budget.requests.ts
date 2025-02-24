export interface CreateBudgetRequest {
    name: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    categoryId: string;
    description?: string;
    isRecurring?: boolean;
    recurrenceType?: 'monthly' | 'yearly';
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> { }

export interface CreateBudgetAlertRequest {
    budgetId: string;
    threshold: number;
}