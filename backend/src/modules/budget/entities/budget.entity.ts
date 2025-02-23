import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../expense/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { BudgetAlert } from './budget-alert.entity';

@Entity('budgets')
export class Budget extends BaseEntity {
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    currentSpent: number;

    @Column({ default: false })
    isRecurring: boolean;

    @Column({ type: 'varchar', nullable: true })
    recurrenceType?: 'monthly' | 'yearly';

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @OneToMany(() => BudgetAlert, alert => alert.budget)
    alerts: BudgetAlert[];
}