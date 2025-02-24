import { Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { authGuard } from '../../core/guards/auth.guard';
import { categoryResolver } from './resolvers/category.resolver';
import { categoryOwnerGuard } from './guards/category-owner.guard';

export const CATEGORY_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CategoryListComponent,
                title: 'Categorías'
            },
            {
                path: 'new',
                component: CategoryFormComponent,
                title: 'Nueva Categoría'
            },
            {
                path: ':id/edit',
                component: CategoryFormComponent,
                title: 'Editar Categoría',
                resolve: {
                    category: categoryResolver
                },
                canActivate: [categoryOwnerGuard]
            }
        ],
        canActivate: [authGuard]
    }
];