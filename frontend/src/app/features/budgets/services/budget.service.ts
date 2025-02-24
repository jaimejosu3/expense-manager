import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Budget, BudgetAlert } from '../../../core/models/budget/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly baseUrl = 'budgets';

  constructor(private http: HttpService) { }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createBudget(budget: Partial<Budget>): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, budget).pipe(
      map(response => response.data)
    );
  }

  updateBudget(id: string, budget: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/${id}`, budget).pipe(
      map(response => response.data)
    );
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Alerts
  createAlert(budgetId: string, alert: Partial<BudgetAlert>): Observable<BudgetAlert> {
    return this.http.post<BudgetAlert>(`${this.baseUrl}/${budgetId}/alerts`, alert).pipe(
      map(response => response.data)
    );
  }

  deleteAlert(budgetId: string, alertId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${budgetId}/alerts/${alertId}`).pipe(
      map(response => response.data)
    );
  }

  // Statistics
  getBudgetProgress(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/progress`).pipe(
      map(response => response.data)
    );
  }

  getBudgetAnalytics(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`, {
      params: { startDate, endDate }
    }).pipe(
      map(response => response.data)
    );
  }
}