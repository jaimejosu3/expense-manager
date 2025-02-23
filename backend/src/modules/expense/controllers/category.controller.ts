import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() userId: string) {
        return this.categoryService.create(createCategoryDto, userId);
    }

    @Get()
    findAll(@CurrentUser() userId: string) {
        return this.categoryService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() userId: string) {
        return this.categoryService.findOne(id, userId);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @CurrentUser() userId: string
    ) {
        return this.categoryService.update(id, updateCategoryDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() userId: string) {
        return this.categoryService.remove(id, userId);
    }
}