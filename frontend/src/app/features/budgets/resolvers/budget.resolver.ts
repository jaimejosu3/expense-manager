import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Budget } from '../../../core/models/budget/budget.model';
import { BudgetService } from '../services/budget.service';

export const budgetResolver: ResolveFn<Budget> = (route) => {
    const budgetService = inject(BudgetService);
    const id = route.paramMap.get('id');

    if (id === null) {
        throw new Error('Budget ID is null');
    }

    return budgetService.getBudgetById(id);
};
