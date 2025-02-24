import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BudgetService } from '../../services/budget.service';
import { CategoryService } from '../../../categories/services/category.service';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatNativeDateModule
  ],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.scss',
  providers: [
    MatNativeDateModule
  ]
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  categories: any[] = [];
  isEditing = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.budgetForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      isRecurring: [false],
      recurrenceType: ['monthly']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const budgetId = this.route.snapshot.paramMap.get('id');
    if (budgetId) {
      this.isEditing = true;
      this.loadBudget(budgetId);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadBudget(id: string): void {
    this.budgetService.getBudgetById(id).subscribe(budget => {
      this.budgetForm.patchValue(budget);
    });
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      if (this.budgetForm.value.budget) this.budgetForm.value.budget = parseFloat(this.budgetForm.value.budget);
      this.loading = true;
      const budgetId = this.route.snapshot.paramMap.get('id');
      const operation = budgetId
        ? this.budgetService.updateBudget(budgetId, this.budgetForm.value)
        : this.budgetService.createBudget(this.budgetForm.value);

      operation.subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}