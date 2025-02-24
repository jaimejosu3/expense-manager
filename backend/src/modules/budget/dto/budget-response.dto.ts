import { ApiProperty } from '@nestjs/swagger';

export class BudgetStatusDto {
    @ApiProperty()
    totalBudget: number;

    @ApiProperty()
    currentSpent: number;

    @ApiProperty()
    remaining: number;

    @ApiProperty()
    percentageUsed: number;

    @ApiProperty()
    isOverBudget: boolean;
}

export class BudgetAlertDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    threshold: number;

    @ApiProperty()
    isTriggered: boolean;

    @ApiProperty({ required: false })
    lastTriggeredAt?: Date;
}

export class BudgetSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    currentSpent: number;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    categoryId: string;

    @ApiProperty()
    categoryName: string;

    @ApiProperty()
    percentageUsed: number;

    @ApiProperty()
    daysRemaining: number;

    @ApiProperty({ type: [BudgetAlertDto] })
    alerts: BudgetAlertDto[];
}

