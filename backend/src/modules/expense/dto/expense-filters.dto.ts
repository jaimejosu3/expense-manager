import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExpenseFiltersDto {
    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    minAmount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    maxAmount?: number;
}