import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { Budget } from '../../../../core/models/budget/budget.model';

@Component({
  selector: 'app-budget-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule],
  templateUrl: './budget-progress.component.html',
  styleUrl: './budget-progress.component.scss'
})
export class BudgetProgressComponent {
  @Input() budget!: Budget;

  get progressPercentage(): number {
    return (this.budget.currentSpent / this.budget.amount) * 100;
  }

  get progressColor(): 'primary' | 'warn' {
    return this.progressPercentage > 90 ? 'warn' : 'primary';
  }

  get remainingAmount(): number {
    return Math.max(0, this.budget.amount - this.budget.currentSpent);
  }

  get isOverBudget(): boolean {
    return this.budget.currentSpent > this.budget.amount;
  }

  get overBudgetAmount(): number {
    return Math.max(0, this.budget.currentSpent - this.budget.amount);
  }
}