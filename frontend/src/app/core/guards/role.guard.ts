import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const user = authService.getCurrentUser();
        if (!allowedRoles?.length) return true;

        if (!user || !user.role) {
            router.navigate(['/dashboard']);
            return false;
        }

        if (allowedRoles.includes(user.role)) {
            return true;
        }
        router.navigate(['/dashboard']);
        return false;
    };
};