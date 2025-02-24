import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { BudgetAlert } from '../entities/budget-alert.entity';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { BudgetFiltersDto } from '../dto/budget-filters.dto';
import { BudgetStatusDto, BudgetSummaryDto } from '../dto/budget-response.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private budgetRepository: Repository<Budget>,
        @InjectRepository(BudgetAlert)
        private budgetAlertRepository: Repository<BudgetAlert>
    ) { }

    async create(createBudgetDto: CreateBudgetDto, userId: User): Promise<Budget> {
        if (new Date(createBudgetDto.endDate) <= new Date(createBudgetDto.startDate)) {
            throw new BadRequestException('End date must be after start date');
        }

        const budget = this.budgetRepository.create({
            ...createBudgetDto,
            userId: userId.id,
            currentSpent: 0
        });

        return await this.budgetRepository.save(budget);
    }

    async findAll(userId: User, filters: BudgetFiltersDto): Promise<BudgetSummaryDto[]> {
        console.log(filters)
        const where: any = { userId: userId.id };

        if (filters.startDate && filters.endDate) {
            where.startDate = Between(filters.startDate, filters.endDate);
        }

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.onlyActive) {
            where.endDate = MoreThanOrEqual(new Date());
        }

        const budgets = await this.budgetRepository.find({
            where,
            relations: ['category', 'alerts'],
            order: { startDate: 'DESC' }
        });

        return budgets.map(budget => this.toBudgetSummary(budget));
    }

    toBudgetSummary(budget: Budget): BudgetSummaryDto {
        const now = new Date();
        const endDate = new Date(budget.endDate);
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        return {
            id: budget.id,
            name: budget.name,
            amount: budget.amount,
            currentSpent: budget.currentSpent,
            startDate: budget.startDate,
            endDate: budget.endDate,
            categoryId: budget.categoryId,
            categoryName: budget.category.name,
            percentageUsed: (budget.currentSpent / budget.amount) * 100,
            daysRemaining,
            alerts: budget.alerts
        };
    }

    async findOneByCategoryAndDate(categoryId: string, date: Date, userId: User): Promise<Budget | undefined> {
        const budget = await this.budgetRepository.findOne({
            where: { categoryId, startDate: LessThanOrEqual(date), endDate: MoreThanOrEqual(date), userId: userId.id },
            relations: ['category', 'alerts']
        });
        console.log(budget)
        return budget || undefined;
    }

    async findOne(id: string, userId: User): Promise<Budget> {
        const budget = await this.budgetRepository.findOne({
            where: { id, userId: userId.id },
            relations: ['category', 'alerts']
        });

        if (!budget) {
            throw new NotFoundException(`Budget with ID "${id}" not found`);
        }

        return budget;
    }

    async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: User): Promise<Budget> {
        const budget = await this.findOne(id, userId);

        if (updateBudgetDto.startDate && updateBudgetDto.endDate) {
            if (new Date(updateBudgetDto.endDate) <= new Date(updateBudgetDto.startDate)) {
                throw new BadRequestException('End date must be after start date');
            }
        }

        Object.assign(budget, updateBudgetDto);
        return await this.budgetRepository.save(budget);
    }

    async remove(id: string, userId: User): Promise<void> {
        const result = await this.budgetRepository.delete({ id, userId: userId.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Budget with ID "${id}" not found`);
        }
    }

    async getBudgetStatus(id: string, userId: User): Promise<BudgetStatusDto> {
        const budget = await this.findOne(id, userId);
        const percentageUsed = (budget.currentSpent / budget.amount) * 100;

        return {
            totalBudget: budget.amount,
            currentSpent: budget.currentSpent,
            remaining: budget.amount - budget.currentSpent,
            percentageUsed,
            isOverBudget: percentageUsed > 100
        };
    }

    async addExpenseAmount(budgetId: string, amount: number): Promise<void> {
        const budget = await this.budgetRepository.findOne({
            where: { id: budgetId }
        });

        if (!budget) {
            throw new NotFoundException(`Budget with ID "${budgetId}" not found`);
        }
        budget.currentSpent = parseFloat(budget.currentSpent.toString()) + amount;
        await this.budgetRepository.save(budget);

        // Check and trigger alerts
        await this.checkBudgetAlerts(budget);
    }

    async removeExpenseAmount(budgetId: string, amount: number): Promise<void> {
        const budget = await this.budgetRepository.findOne({
            where: { id: budgetId }
        });

        if (!budget) {
            throw new NotFoundException(`Budget with ID "${budgetId}" not found`);
        }
        budget.currentSpent = parseFloat(budget.currentSpent.toString()) - amount;
        await this.budgetRepository.save(budget);

        // Check and trigger alerts
        await this.checkBudgetAlerts(budget);
    }

    private async checkBudgetAlerts(budget: Budget): Promise<void> {
        const percentageUsed = (budget.currentSpent / budget.amount) * 100;
        const alerts = await this.budgetAlertRepository.find({
            where: { budgetId: budget.id, isTriggered: false }
        });

        for (const alert of alerts) {
            if (percentageUsed >= alert.threshold) {
                alert.isTriggered = true;
                alert.lastTriggeredAt = new Date();
                await this.budgetAlertRepository.save(alert);
            }
        }
    }
}