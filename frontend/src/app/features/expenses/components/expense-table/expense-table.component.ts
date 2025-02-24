import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss'
})
export class ExpenseTableComponent {
  @Input() expenses: Expense[] = [];
  @Input() loading = false;
  @Output() onEdit = new EventEmitter<Expense>();
  @Output() onDelete = new EventEmitter<Expense>();

  displayedColumns = ['date', 'description', 'category', 'amount', 'actions'];
}
