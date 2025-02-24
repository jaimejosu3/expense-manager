import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ExpenseFilterComponent } from '../../components/expense-filter/expense-filter.component';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ExpenseFilterComponent,
    ExpenseTableComponent
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  loading = false;

  constructor(private expenseService: ExpenseService, private router: Router) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(filters: any): void {
    this.loading = true;
    if (filters.startDate) {
      filters.startDate = filters.startDate instanceof Date
        ? filters.startDate.toISOString().split('T')[0]
        : filters.startDate;
    } else {
      delete filters.startDate;
    }

    if (filters.endDate) {
      filters.endDate = filters.endDate instanceof Date
        ? filters.endDate.toISOString().split('T')[0]
        : filters.endDate;
    } else {
      delete filters.endDate;
    }

    if (!filters.category) delete filters.category;
    this.expenseService.getExpenses(filters).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onEdit(expense: Expense): void {
    this.router.navigate(['/expenses/' + expense.id + '/edit']);
  }

  onDelete(expense: Expense): void {
    this.expenseService.deleteExpense(expense.id).subscribe(() => {
      this.loadExpenses();
    });
  }
}