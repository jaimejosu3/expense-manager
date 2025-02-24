import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../../categories/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  categories: any[] = [];
  currentExpenseId = '';
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      date: [new Date(), Validators.required],
      notes: ['']
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.expenseService.getExpenseById(params['id']).subscribe(expense => {
          this.currentExpenseId = expense.id;
          this.expenseForm.patchValue(expense);
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      if (this.isEditing) {
        this.expenseService.updateExpense(this.currentExpenseId, this.expenseForm.value).subscribe({
          next: () => {
            this.router.navigate(['/expenses']);
          }
        });
      } else {
        this.expenseService.createExpense(this.expenseForm.value).subscribe({
          next: () => {
            this.expenseForm.reset();
          }
        });
      }
    }
  }
}