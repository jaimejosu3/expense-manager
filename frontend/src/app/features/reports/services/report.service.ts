import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { ExpenseAnalytics } from '../../../core/interfaces/responses/analytics.response';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly baseUrl = 'reports';

  constructor(private http: HttpService) { }

  getMonthlyReport(year: number, month: number): Observable<ExpenseAnalytics> {
    return this.http.get<ExpenseAnalytics>(`${this.baseUrl}/monthly/${year}/${month}`).pipe(
      map(response => response.data)
    );
  }

  getCategoryReport(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`, {
      params: { startDate, endDate }
    }).pipe(
      map(response => response.data)
    );
  }

  getTrendAnalysis(months: number = 6): Observable<any> {
    return this.http.get(`${this.baseUrl}/trends`, {
      params: { months }
    }).pipe(
      map(response => response.data)
    );
  }

  getBudgetComparison(): Observable<any> {
    return this.http.get(`${this.baseUrl}/budget-comparison`).pipe(
      map(response => response.data)
    );
  }
}