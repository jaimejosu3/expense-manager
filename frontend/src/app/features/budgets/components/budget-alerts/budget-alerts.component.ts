import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BudgetAlert } from '../../../../core/models/budget/budget.model';

@Component({
  selector: 'app-budget-alerts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './budget-alerts.component.html',
  styleUrl: './budget-alerts.component.scss'
})
export class BudgetAlertsComponent {
  @Input() alerts: BudgetAlert[] = [];
  @Output() addAlert = new EventEmitter<void>();
  @Output() delete = new EventEmitter<BudgetAlert>();
}