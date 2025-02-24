export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        REGISTER: 'auth/register',
        PROFILE: 'auth/profile'
    },
    EXPENSES: {
        BASE: 'expenses',
        REPORTS: 'expenses/reports',
        CATEGORIES: 'expenses/categories'
    },
    BUDGETS: {
        BASE: 'budgets',
        ALERTS: 'budgets/alerts'
    }
} as const;