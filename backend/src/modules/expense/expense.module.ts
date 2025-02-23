import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { CategoryModule } from './category.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense]),
        CategoryModule
    ],
    providers: [ExpenseService],
    controllers: [ExpenseController],
    exports: [ExpenseService]
})
export class ExpenseModule { }