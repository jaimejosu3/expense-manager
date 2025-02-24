import { Routes } from '@angular/router';
import { BudgetListComponent } from './pages/budget-list/budget-list.component';
import { BudgetFormComponent } from './pages/budget-form/budget-form.component';
import { authGuard } from '../../core/guards/auth.guard';
import { budgetResolver } from './resolvers/budget.resolver';
import { budgetOwnerGuard } from './guards/budget-owner.guard';

export const BUDGET_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BudgetListComponent,
                title: 'Presupuestos'
            },
            {
                path: 'new',
                component: BudgetFormComponent,
                title: 'Nuevo Presupuesto'
            },
            {
                path: ':id/edit',
                component: BudgetFormComponent,
                title: 'Editar Presupuesto',
                resolve: {
                    budget: budgetResolver
                },
                canActivate: [budgetOwnerGuard]
            }
        ],
        canActivate: [authGuard]
    }
];