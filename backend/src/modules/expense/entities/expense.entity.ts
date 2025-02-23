import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from './category.entity';
import { User } from '../../user/entities/user.entity';

@Entity('expenses')
export class Expense extends BaseEntity {
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @ManyToOne(() => Category, category => category.expenses)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}