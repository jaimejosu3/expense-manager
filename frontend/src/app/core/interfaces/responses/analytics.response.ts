export interface ExpenseAnalytics {
    totalExpenses: number;
    monthlyAverage: number;
    topCategories: {
        categoryId: string;
        categoryName: string;
        total: number;
        percentage: number;
    }[];
    monthlyTrend: {
        month: string;
        total: number;
        count: number;
    }[];
}

export interface BudgetAnalytics {
    totalBudgets: number;
    activeBudgets: number;
    totalAllocated: number;
    totalSpent: number;
    overBudgetCount: number;
    nearThresholdCount: number;
    budgetUtilization: {
        budgetId: string;
        budgetName: string;
        allocated: number;
        spent: number;
        remaining: number;
        percentageUsed: number;
    }[];
}