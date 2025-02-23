import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    loadingService.show();

    return next(req).pipe(
        catchError(error => {
            loadingService.reset(); // Reset en caso de error
            throw error;
        }),
        finalize(() => {
            loadingService.hide();
        })
    );
};