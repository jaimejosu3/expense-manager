import { IsOptional, IsDateString, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BudgetFiltersDto {
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
    @IsBoolean()
    @IsOptional()
    onlyActive?: boolean;
}