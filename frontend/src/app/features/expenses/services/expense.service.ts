// src/app/features/expenses/services/expense.service.ts
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Expense } from '../../../core/models/expense/expense.model';
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseFilters
} from '../../../core/interfaces/requests/expense.requests';
import { PaginatedResponse } from '../../../core/interfaces/common/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly baseUrl = 'expenses';

  constructor(private http: HttpService) { }

  getExpenses(filters?: ExpenseFilters): Observable<PaginatedResponse<Expense>> {
    return this.http.get<PaginatedResponse<Expense>>(this.baseUrl, filters)
      .pipe(
        map(response => response.data)
      );
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  createExpense(expense: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense)
      .pipe(
        map(response => response.data)
      );
  }

  updateExpense(id: string, expense: UpdateExpenseRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, expense)
      .pipe(
        map(response => response.data)
      );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  getExpenseAnalytics(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics`, { startDate, endDate })
      .pipe(
        map(response => response.data)
      );
  }

  uploadReceipt(expenseId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('receipt', file);

    return this.http.post(`${this.baseUrl}/${expenseId}/receipt`, formData)
      .pipe(
        map(response => response.data)
      );
  }
}