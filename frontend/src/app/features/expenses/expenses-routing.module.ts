import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EXPENSE_ROUTES } from './expenses.router';

const routes: Routes = EXPENSE_ROUTES;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
