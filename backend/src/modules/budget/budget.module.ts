import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { BudgetAlert } from './entities/budget-alert.entity';
import { BudgetService } from './services/budget.service';
import { BudgetAlertService } from './services/budget-alert.service';
import { BudgetController } from './controllers/budget.controller';
import { BudgetAlertController } from './controllers/budget-alert.controller';
import { CategoryModule } from '../expense/category.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Budget, BudgetAlert]),
        CategoryModule
    ],
    providers: [
        BudgetService,
        BudgetAlertService
    ],
    controllers: [
        BudgetController,
        BudgetAlertController
    ],
    exports: [
        BudgetService,
        BudgetAlertService
    ]
})
export class BudgetModule { }