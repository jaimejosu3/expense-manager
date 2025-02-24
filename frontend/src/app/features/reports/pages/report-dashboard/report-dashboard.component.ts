import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseChartComponent } from '../../components/expense-chart/expense-chart.component';
import { ReportService } from '../../services/report.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    ExpenseChartComponent
  ],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.scss'
})
export class ReportDashboardComponent implements OnInit {
  filterForm: FormGroup;
  monthlyData: any = {};
  categoryData: any = {};
  trendData: any = {};
  budgetData: any = {};

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const filters = this.filterForm.value;
    this.loadMonthlyReport();
    this.loadCategoryReport(filters.startDate, filters.endDate);
    this.loadTrendAnalysis();
    this.loadBudgetComparison();
  }

  loadMonthlyReport(): void {
    const now = new Date();
    this.reportService.getMonthlyReport(now.getFullYear(), now.getMonth() + 1)
      .subscribe(data => {
        this.monthlyData = this.formatChartData(data);
      });
  }

  loadCategoryReport(startDate: Date, endDate: Date): void {
    this.reportService.getCategoryReport(startDate, endDate)
      .subscribe(data => {
        this.categoryData = this.formatChartData(data);
      });
  }

  loadTrendAnalysis(): void {
    this.reportService.getTrendAnalysis()
      .subscribe(data => {
        this.trendData = this.formatChartData(data);
      });
  }

  loadBudgetComparison(): void {
    this.reportService.getBudgetComparison()
      .subscribe(data => {
        this.budgetData = this.formatChartData(data);
      });
  }

  private formatChartData(data: any): any {
    // Implementar la lógica de formateo según el tipo de gráfico
    return data;
  }

  applyFilters(): void {
    this.loadReports();
  }

}