import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../../expenses/services/expense.service';

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './expense-summary.component.html',
  styleUrl: './expense-summary.component.scss'
})
export class ExpenseSummaryComponent implements OnInit {
  totalExpenses = 0;
  trend = 0;

  constructor(private readonly expenseService: ExpenseService) {
  }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dateParams = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    this.expenseService.getExpenses({ ...dateParams }).subscribe(expenses => {
      this.totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount.toString()), 0);
    });
  }
}