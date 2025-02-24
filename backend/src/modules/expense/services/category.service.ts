import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, userId: User): Promise<Category> {
        const category = this.categoryRepository.create({
            ...createCategoryDto,
            userId: userId.id,
        });
        return await this.categoryRepository.save(category);
    }

    async findAll(userId: User): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { userId: userId.id, isActive: true },
            order: { name: 'ASC' }
        });
    }

    async findOne(id: string, userId: User): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id, userId: userId.id }
        });
        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: User): Promise<Category> {
        const category = await this.findOne(id, userId);
        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async remove(id: string, userId: User): Promise<void> {
        const category = await this.findOne(id, userId);
        category.isActive = false;
        await this.categoryRepository.save(category);
    }
}