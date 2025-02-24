import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ExpenseFiltersDto } from '../dto/expense-filters.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { BudgetService } from 'src/modules/budget/services/budget.service';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
        private budgetService: BudgetService
    ) { }

    async create(createExpenseDto: CreateExpenseDto, userId: User): Promise<Expense> {
        const expense = this.expenseRepository.create({
            ...createExpenseDto,
            userId: userId.id,
        });
        let budgets = await this.budgetService.findAll(userId, { onlyActive: true });
        if (budgets.length > 0) {
            console.log(budgets, expense.categoryId);
            let budget = budgets.find(budget => budget.categoryId === expense.categoryId);

            console.log(budget, expense);
            if (budget) {
                this.budgetService.addExpenseAmount(budget.id, expense.amount);
            }
        }
        return await this.expenseRepository.save(expense);
    }

    async findAll(userId: User, filters: ExpenseFiltersDto): Promise<Expense[]> {
        const where: any = { userId: userId.id };

        if (filters.startDate && filters.endDate) {
            where.date = Between(filters.startDate, filters.endDate);
        } else if (filters.startDate) {
            where.date = MoreThanOrEqual(filters.startDate);
        } else if (filters.endDate) {
            where.date = LessThanOrEqual(filters.endDate);
        }

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.minAmount) {
            where.amount = MoreThanOrEqual(filters.minAmount);
        }

        if (filters.maxAmount) {
            where.amount = LessThanOrEqual(filters.maxAmount);
        }

        return await this.expenseRepository.find({
            where,
            relations: ['category'],
            order: { date: 'DESC' },
        });
    }

    async findOne(id: string, userId: User): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({
            where: { id, userId: userId.id },
            relations: ['category'],
        });

        if (!expense) {
            throw new NotFoundException(`Expense with ID "${id}" not found`);
        }

        return expense;
    }

    async update(id: string, updateExpenseDto: Partial<CreateExpenseDto>, userId: User): Promise<Expense> {
        const expense = await this.findOne(id, userId);
        Object.assign(expense, updateExpenseDto);
        return await this.expenseRepository.save(expense);
    }

    async remove(id: string, userId: User): Promise<void> {
        const result = await this.expenseRepository.delete({ id, userId: userId.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Expense with ID "${id}" not found`);
        }
    }

    async getMonthlyTotal(userId: User, date: Date): Promise<number> {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const result = await this.expenseRepository
            .createQueryBuilder('expense')
            .where('expense.userId = :userId', { userId: userId.id })
            .andWhere('expense.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
            .select('SUM(expense.amount)', 'total')
            .getRawOne();

        return result.total || 0;
    }

    async getExpensesByCategory(userId: User, startDate: Date, endDate: Date): Promise<any[]> {
        return await this.expenseRepository
            .createQueryBuilder('expense')
            .leftJoinAndSelect('expense.category', 'category')
            .where('expense.userId = :userId', { userId: userId.id })
            .andWhere('expense.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
            .select([
                'category.name',
                'category.color',
                'SUM(expense.amount) as total',
                'COUNT(expense.id) as count',
            ])
            .groupBy('category.id')
            .getRawMany();
    }
}