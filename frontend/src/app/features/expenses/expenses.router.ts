import { Routes } from '@angular/router';
import { ExpenseListComponent } from './pages/expense-list/expense-list.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { authGuard } from '../../core/guards/auth.guard';
import { expenseResolver } from './resolvers/expense.resolver';
import { expenseOwnerGuard } from './guards/expense-owner.guard';

export const EXPENSE_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ExpenseListComponent,
                title: 'Gastos'
            },
            {
                path: 'new',
                component: ExpenseFormComponent,
                title: 'Nuevo Gasto'
            },
            {
                path: ':id/edit',
                component: ExpenseFormComponent,
                title: 'Editar Gasto',
                resolve: {
                    expense: expenseResolver
                },
                canActivate: [expenseOwnerGuard]
            }
        ],
        canActivate: [authGuard]
    }
];