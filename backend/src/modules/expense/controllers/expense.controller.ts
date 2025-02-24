import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { ExpenseFiltersDto } from '../dto/expense-filters.dto';
import { User } from 'src/modules/user/entities/user.entity';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    @Post()
    create(@Body() createExpenseDto: CreateExpenseDto, @CurrentUser() userId: User) {
        return this.expenseService.create(createExpenseDto, userId);
    }

    @Get()
    findAll(@CurrentUser() userId: User, @Query() filters: ExpenseFiltersDto) {
        return this.expenseService.findAll(userId, filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() userId: User) {
        return this.expenseService.findOne(id, userId);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateExpenseDto: UpdateExpenseDto,
        @CurrentUser() userId: User
    ) {
        return this.expenseService.update(id, updateExpenseDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() userId: User) {
        return this.expenseService.remove(id, userId);
    }
}