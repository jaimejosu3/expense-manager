import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BudgetService } from '../services/budget.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const budgetOwnerGuard: CanActivateFn = (route) => {
    const budgetService = inject(BudgetService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        return false;
    }

    return budgetService.getBudgetById(id).pipe(
        map(budget => {
            // Aquí implementarías la lógica real de verificación de propiedad
            const isOwner = true;
            if (!isOwner) {
                router.navigate(['/budgets']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            router.navigate(['/budgets']);
            return of(false);
        })
    );
};