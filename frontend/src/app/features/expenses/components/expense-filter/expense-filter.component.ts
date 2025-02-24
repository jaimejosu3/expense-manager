import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpenseFilters } from '../../../../core/interfaces/requests/expense.requests';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expense-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule
  ],
  templateUrl: './expense-filter.component.html',
  styleUrl: './expense-filter.component.scss'
})
export class ExpenseFilterComponent {
  @Output() filterChange = new EventEmitter<ExpenseFilters>();

  filterForm: FormGroup;
  categories: any[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      categoryId: [''],
    });
  }

  onSubmit(): void {
    this.filterChange.emit(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filterChange.emit({});
  }
}
