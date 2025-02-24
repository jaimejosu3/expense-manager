import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { BudgetAlertService } from '../services/budget-alert.service';
import { CreateBudgetAlertDto } from '../dto/create-budget-alert.dto';
import { BudgetAlertDto } from '../dto/budget-response.dto';
import { User } from '../../user/entities/user.entity';

@ApiTags('budget-alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budget-alerts')
export class BudgetAlertController {
    constructor(private readonly budgetAlertService: BudgetAlertService) { }

    @Post()
    @ApiOperation({ summary: 'Create new budget alert' })
    @ApiResponse({ status: HttpStatus.CREATED, type: BudgetAlertDto })
    create(
        @Body() createBudgetAlertDto: CreateBudgetAlertDto,
        @CurrentUser() userId: User
    ) {
        return this.budgetAlertService.create(createBudgetAlertDto, userId);
    }

    @Get('budget/:budgetId')
    @ApiOperation({ summary: 'Get alerts by budget' })
    @ApiResponse({ status: HttpStatus.OK, type: [BudgetAlertDto] })
    findByBudget(
        @Param('budgetId') budgetId: string,
        @CurrentUser() userId: User
    ) {
        return this.budgetAlertService.findByBudget(budgetId, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete budget alert' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    remove(
        @Param('id') id: string,
        @CurrentUser() userId: User
    ) {
        return this.budgetAlertService.remove(id, userId);
    }

    @Put(':id/reset')
    @ApiOperation({ summary: 'Reset budget alert' })
    @ApiResponse({ status: HttpStatus.OK, type: BudgetAlertDto })
    resetAlert(
        @Param('id') id: string,
        @CurrentUser() userId: User
    ) {
        return this.budgetAlertService.resetAlert(id, userId);
    }
}