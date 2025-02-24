import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const categoryOwnerGuard: CanActivateFn = (route) => {
    const categoryService = inject(CategoryService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        return false;
    }

    return categoryService.getCategoryById(id).pipe(
        map(category => {
            // Verificar que el usuario actual es el propietario de la categoría
            const isOwner = true; // Implementar lógica real con AuthService
            if (!isOwner) {
                router.navigate(['/categories']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            router.navigate(['/categories']);
            return of(false);
        })
    );
};