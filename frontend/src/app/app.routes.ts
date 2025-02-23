import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout.component')
            .then(m => m.MainLayoutComponent),
        loadChildren: () => import('./layouts/main-layout/main-layout.routes')
            .then(m => m.MAIN_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];