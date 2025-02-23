import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Expense } from './expense.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    color: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budget?: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Expense, expense => expense.category)
    expenses: Expense[];

    @Column()
    userId: string;
}