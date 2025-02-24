import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const MAIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'expenses',
        loadChildren: () => import('../../features/expenses/expenses.router').then(m => m.EXPENSE_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'categories',
        loadChildren: () => import('../../features/categories/category.routes')
            .then(m => m.CATEGORY_ROUTES)
    },
    {
        path: 'budgets',
        loadChildren: () => import('../../features/budgets/budget.routes')
            .then(m => m.BUDGET_ROUTES)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];