import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsDateString()
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isRecurring?: boolean;

    @ApiProperty({ required: false, enum: ['monthly', 'yearly'] })
    @IsEnum(['monthly', 'yearly'])
    @IsOptional()
    recurrenceType?: 'monthly' | 'yearly';
}