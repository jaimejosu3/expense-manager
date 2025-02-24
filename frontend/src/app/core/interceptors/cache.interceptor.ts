import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        return next(req);
    }

    const cacheService = inject(CacheService);
    const cachedResponse = cacheService.get(req.url);

    if (cachedResponse) {
        return of(cachedResponse);
    }

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                cacheService.set(req.url, event);
            }
        })
    );
};