import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetAlert } from '../entities/budget-alert.entity';
import { CreateBudgetAlertDto } from '../dto/create-budget-alert.dto';
import { BudgetService } from './budget.service';

@Injectable()
export class BudgetAlertService {
    constructor(
        @InjectRepository(BudgetAlert)
        private budgetAlertRepository: Repository<BudgetAlert>,
        private budgetService: BudgetService,
    ) { }

    async create(createBudgetAlertDto: CreateBudgetAlertDto, userId: string): Promise<BudgetAlert> {
        // Verify budget exists and belongs to user
        await this.budgetService.findOne(createBudgetAlertDto.budgetId, userId);

        const alert = this.budgetAlertRepository.create(createBudgetAlertDto);
        return await this.budgetAlertRepository.save(alert);
    }

    async findByBudget(budgetId: string, userId: string): Promise<BudgetAlert[]> {
        // Verify budget exists and belongs to user
        await this.budgetService.findOne(budgetId, userId);

        return await this.budgetAlertRepository.find({
            where: { budgetId },
            order: { threshold: 'ASC' }
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        const alert = await this.budgetAlertRepository.findOne({
            where: { id },
            relations: ['budget']
        });

        if (!alert || alert.budget.userId !== userId) {
            throw new NotFoundException(`Alert with ID "${id}" not found`);
        }

        await this.budgetAlertRepository.remove(alert);
    }

    async resetAlert(id: string, userId: string): Promise<BudgetAlert> {
        const alert = await this.budgetAlertRepository.findOne({
            where: { id },
            relations: ['budget']
        });

        if (!alert || alert.budget.userId !== userId) {
            throw new NotFoundException(`Alert with ID "${id}" not found`);
        }

        alert.isTriggered = false;
        alert.lastTriggeredAt = undefined;
        return await this.budgetAlertRepository.save(alert);
    }
}