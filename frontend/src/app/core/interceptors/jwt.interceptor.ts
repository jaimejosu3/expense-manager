import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const storageService = inject(StorageService);
    const token = storageService.get<string>(STORAGE_KEYS.TOKEN);
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (token && isApiUrl) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};