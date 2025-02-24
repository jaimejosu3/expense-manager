import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Category } from '../../../core/models/category/category.model';
import { PaginatedResponse } from '../../../core/interfaces/common/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'categories';

  constructor(private http: HttpService) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getCategoryStatistics(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/statistics`).pipe(
      map(response => response.data)
    );
  }
}