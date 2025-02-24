import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Category } from '../../../core/models/category/category.model';
import { CategoryService } from '../services/category.service';

export const categoryResolver: ResolveFn<Category> = (route) => {
    const categoryService = inject(CategoryService);
    const id = route.paramMap.get('id');
    if (id === null) {
        throw new Error('Category ID is null');
    }
    return categoryService.getCategoryById(id);
};