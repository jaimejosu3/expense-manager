import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isRecurring?: boolean;

    @ApiProperty({ required: false, enum: ['daily', 'weekly', 'monthly', 'yearly'] })
    @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
    @IsOptional()
    recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}