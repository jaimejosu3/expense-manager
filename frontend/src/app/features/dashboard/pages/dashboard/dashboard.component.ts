import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExpenseSummaryComponent } from '../../components/expense-summary/expense-summary.component';
import { BudgetOverviewComponent } from '../../components/budget-overview/budget-overview.component';
import { RecentTransactionsComponent } from '../../components/recent-transactions/recent-transactions.component';
import { CategoryDistributionComponent } from '../../components/category-distribution/category-distribution.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ExpenseSummaryComponent,
    BudgetOverviewComponent,
    RecentTransactionsComponent,
    CategoryDistributionComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}