import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Budget } from './budget.entity';

@Entity('budget_alerts')
export class BudgetAlert extends BaseEntity {
    @Column('decimal', { precision: 5, scale: 2 })
    threshold: number; // Porcentaje del presupuesto (ej: 80 para 80%)

    @Column({ default: false })
    isTriggered: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastTriggeredAt?: Date;

    @ManyToOne(() => Budget, budget => budget.alerts)
    @JoinColumn({ name: 'budgetId' })
    budget: Budget;

    @Column()
    budgetId: string;
}