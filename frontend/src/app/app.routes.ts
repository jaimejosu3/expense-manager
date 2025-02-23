import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout.component')
            .then(m => m.MainLayoutComponent),
        loadChildren: () => import('./layouts/main-layout/main-layout.routes')
            .then(m => m.MAIN_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];