import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { CategoryModule } from './category.module';
import { BudgetModule } from '../budget/budget.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense]),
        CategoryModule,
        BudgetModule
    ],
    providers: [ExpenseService],
    controllers: [ExpenseController],
    exports: [ExpenseService]
})
export class ExpenseModule { }