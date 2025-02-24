export interface Budget {
    id: string;
    name: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    categoryId: string;
    categoryName: string;
    userId: string;
    currentSpent: number;
    isRecurring: boolean;
    recurrenceType?: 'monthly' | 'yearly';
    description?: string;
    alerts?: BudgetAlert[];
    createdAt: Date;
    updatedAt: Date;
}

export interface BudgetAlert {
    id: string;
    budgetId: string;
    threshold: number;
    isTriggered: boolean;
    lastTriggeredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}