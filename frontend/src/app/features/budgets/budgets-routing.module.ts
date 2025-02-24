import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BUDGET_ROUTES } from './budget.routes';

const routes: Routes = BUDGET_ROUTES;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
