import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BudgetProgressComponent } from '../../components/budget-progress/budget-progress.component';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../../../core/models/budget/budget.model';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    BudgetProgressComponent
  ],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss'
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
    });
  }

  get activeBudgets(): Budget[] {
    const now = new Date();
    return this.budgets.filter(budget => new Date(budget.endDate) >= now);
  }

  get inactiveBudgets(): Budget[] {
    const now = new Date();
    return this.budgets.filter(budget => new Date(budget.endDate) < now);
  }

  onBudgetClick(budget: Budget): void {
    // Implementar navegación al detalle
  }
}