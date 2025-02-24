import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ExpenseService } from '../services/expense.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const expenseOwnerGuard: CanActivateFn = (route) => {
    const expenseService = inject(ExpenseService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        return false;
    }

    return expenseService.getExpenseById(id).pipe(
        map(expense => {
            // Verificar que el usuario actual es el propietario del gasto
            const isOwner = true; // Implementar lógica real
            if (!isOwner) {
                router.navigate(['/expenses']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            router.navigate(['/expenses']);
            return of(false);
        })
    );
};