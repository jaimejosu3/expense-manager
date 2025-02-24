import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Expense } from '../../../core/models/expense/expense.model';
import { ExpenseService } from '../services/expense.service';

export const expenseResolver: ResolveFn<Expense> = (route) => {
    const expenseService = inject(ExpenseService);
    const id = route.paramMap.get('id');

    if (id === null) {
        throw new Error('Expense ID is null');
    }
    return expenseService.getExpenseById(id);
};
