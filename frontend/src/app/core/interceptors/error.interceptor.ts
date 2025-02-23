import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if ([401, 403].includes(error.status)) {
                authService.logout();
                router.navigate(['/auth/login']);
                snackBar.open('Sesión expirada. Por favor, inicie sesión nuevamente.', 'Cerrar', {
                    duration: 5000
                });
            } else if (error.status === 404) {
                snackBar.open('Recurso no encontrado', 'Cerrar', {
                    duration: 3000
                });
            } else if (error.status === 500) {
                snackBar.open('Error en el servidor. Por favor, intente más tarde', 'Cerrar', {
                    duration: 3000
                });
            }

            return throwError(() => error);
        })
    );
};
