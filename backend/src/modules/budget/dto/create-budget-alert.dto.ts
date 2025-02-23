import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetAlertDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    threshold: number;

    @ApiProperty()
    @IsNotEmpty()
    budgetId: string;
}