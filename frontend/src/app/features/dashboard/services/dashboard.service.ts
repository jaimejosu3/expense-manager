import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { DashboardSummary } from '../../../core/interfaces/responses/dashboard.response';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private http: HttpService) { }

    getExpensesByCategory(startDate: Date, endDate: Date): Observable<any> {
        return this.http.get('dashboard/expenses-by-category', { startDate, endDate });
    }

    getMonthlyTrend(): Observable<any> {
        return this.http.get('dashboard/monthly-trend');
    }

    getRecentTransactions(limit: number = 5): Observable<any> {
        return this.http.get('dashboard/recent-transactions', { limit });
    }
}