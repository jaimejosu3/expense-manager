import { Expense } from "../../models/expense/expense.model";

export interface DashboardSummary {
    currentMonthExpenses: number;
    previousMonthExpenses: number;
    monthlyChange: number;
    recentTransactions: Expense[];
    upcomingBills: {
        description: string;
        amount: number;
        dueDate: Date;
    }[];
    budgetAlerts: {
        budgetName: string;
        percentage: number;
        threshold: number;
    }[];
    categoryBreakdown: {
        categoryName: string;
        amount: number;
        percentage: number;
        trend: 'up' | 'down' | 'stable';
    }[];
}