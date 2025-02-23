import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { BudgetFiltersDto } from '../dto/budget-filters.dto';
import { BudgetStatusDto, BudgetSummaryDto } from '../dto/budget-response.dto';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @Post()
    @ApiOperation({ summary: 'Create new budget' })
    @ApiResponse({ status: HttpStatus.CREATED, type: BudgetSummaryDto })
    async create(
        @Body() createBudgetDto: CreateBudgetDto,
        @CurrentUser() userId: string
    ) {
        const budget = await this.budgetService.create(createBudgetDto, userId);
        return this.budgetService.toBudgetSummary(budget);
    }

    @Get()
    @ApiOperation({ summary: 'Get all budgets' })
    @ApiResponse({ status: HttpStatus.OK, type: [BudgetSummaryDto] })
    findAll(
        @CurrentUser() userId: string,
        @Query() filters: BudgetFiltersDto
    ) {
        return this.budgetService.findAll(userId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get budget by id' })
    @ApiResponse({ status: HttpStatus.OK, type: BudgetSummaryDto })
    async findOne(
        @Param('id') id: string,
        @CurrentUser() userId: string
    ) {
        const budget = await this.budgetService.findOne(id, userId);
        return this.budgetService.toBudgetSummary(budget);
    }

    @Get(':id/status')
    @ApiOperation({ summary: 'Get budget status' })
    @ApiResponse({ status: HttpStatus.OK, type: BudgetStatusDto })
    getBudgetStatus(
        @Param('id') id: string,
        @CurrentUser() userId: string
    ) {
        return this.budgetService.getBudgetStatus(id, userId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update budget' })
    @ApiResponse({ status: HttpStatus.OK, type: BudgetSummaryDto })
    async update(
        @Param('id') id: string,
        @Body() updateBudgetDto: UpdateBudgetDto,
        @CurrentUser() userId: string
    ) {
        const budget = await this.budgetService.update(id, updateBudgetDto, userId);
        return this.budgetService.toBudgetSummary(budget);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete budget' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    remove(
        @Param('id') id: string,
        @CurrentUser() userId: string
    ) {
        return this.budgetService.remove(id, userId);
    }
}