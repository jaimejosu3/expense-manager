import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { User } from '../../user/entities/user.entity';

describe('CategoryService', () => {
    let service: CategoryService;
    let categoryRepository: jest.Mocked<Repository<Category>>;

    const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockCategory: Category = {
        id: '1',
        name: 'Alimentación',
        description: 'Gastos en comida y restaurantes',
        color: '#FF5733',
        budget: 1000,
        isActive: true,
        userId: mockUser.id,
        expenses: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository
                }
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        categoryRepository = module.get(getRepositoryToken(Category));
    });

    describe('create', () => {
        const createCategoryDto = {
            name: 'Alimentación',
            description: 'Gastos en comida y restaurantes',
            color: '#FF5733',
            budget: 1000
        };

        it('debería crear una categoría correctamente', async () => {
            categoryRepository.create.mockReturnValue(mockCategory);
            categoryRepository.save.mockResolvedValue(mockCategory);

            const result = await service.create(createCategoryDto, mockUser as User);

            expect(result).toEqual(mockCategory);
            expect(categoryRepository.create).toHaveBeenCalledWith({
                ...createCategoryDto,
                userId: mockUser.id
            });
            expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
        });

        it('debería crear una categoría sin presupuesto', async () => {
            const dtoCategoryWithoutBudget = {
                name: 'Otros',
                description: 'Gastos varios',
                color: '#000000'
            };

            const categoryWithoutBudget = {
                ...mockCategory,
                name: 'Otros',
                description: 'Gastos varios',
                color: '#000000',
                budget: undefined
            };

            categoryRepository.create.mockReturnValue(categoryWithoutBudget);
            categoryRepository.save.mockResolvedValue(categoryWithoutBudget);

            const result = await service.create(dtoCategoryWithoutBudget, mockUser as User);

            expect(result.budget).toBeUndefined();
        });
    });

    describe('findAll', () => {
        it('debería retornar todas las categorías activas del usuario', async () => {
            const mockCategories = [
                mockCategory,
                { ...mockCategory, id: '2', name: 'Transporte' }
            ];

            categoryRepository.find.mockResolvedValue(mockCategories);

            const result = await service.findAll(mockUser as User);

            expect(result).toEqual(mockCategories);
            expect(categoryRepository.find).toHaveBeenCalledWith({
                where: {
                    userId: mockUser.id,
                    isActive: true
                },
                order: { name: 'ASC' }
            });
        });

        it('debería retornar un array vacío si no hay categorías', async () => {
            categoryRepository.find.mockResolvedValue([]);

            const result = await service.findAll(mockUser as User);

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('debería encontrar una categoría por ID', async () => {
            categoryRepository.findOne.mockResolvedValue(mockCategory);

            const result = await service.findOne(mockCategory.id, mockUser as User);

            expect(result).toEqual(mockCategory);
            expect(categoryRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: mockCategory.id,
                    userId: mockUser.id
                }
            });
        });

        it('debería lanzar NotFoundException cuando no existe la categoría', async () => {
            categoryRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999', mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });

        it('debería encontrar una categoría inactiva', async () => {
            const inactiveCategory = { ...mockCategory, isActive: false };
            categoryRepository.findOne.mockResolvedValue(inactiveCategory);

            const result = await service.findOne(mockCategory.id, mockUser as User);

            expect(result.isActive).toBeFalsy();
        });
    });

    describe('update', () => {
        const updateCategoryDto = {
            name: 'Alimentación actualizada',
            budget: 1500
        };

        it('debería actualizar una categoría correctamente', async () => {
            const updatedCategory = { ...mockCategory, ...updateCategoryDto };

            categoryRepository.findOne.mockResolvedValue(mockCategory);
            categoryRepository.save.mockResolvedValue(updatedCategory);

            const result = await service.update(mockCategory.id, updateCategoryDto, mockUser as User);

            expect(result).toEqual(updatedCategory);
            expect(result.name).toBe(updateCategoryDto.name);
            expect(result.budget).toBe(updateCategoryDto.budget);
        });

        it('debería mantener los campos no actualizados', async () => {
            const partialUpdate = { name: 'Nuevo nombre' };
            const expectedCategory = { ...mockCategory, name: 'Nuevo nombre' };

            categoryRepository.findOne.mockResolvedValue(mockCategory);
            categoryRepository.save.mockResolvedValue(expectedCategory);

            const result = await service.update(mockCategory.id, partialUpdate, mockUser as User);

            expect(result.color).toBe(mockCategory.color);
            expect(result.description).toBe(mockCategory.description);
        });

        it('debería lanzar NotFoundException al actualizar categoría inexistente', async () => {
            categoryRepository.findOne.mockResolvedValue(null);

            await expect(service.update('999', updateCategoryDto, mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('debería realizar soft delete de una categoría', async () => {
            categoryRepository.findOne.mockResolvedValue(mockCategory);
            const inactiveCategory = { ...mockCategory, isActive: false };
            categoryRepository.save.mockResolvedValue(inactiveCategory);

            await service.remove(mockCategory.id, mockUser as User);

            expect(categoryRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: mockCategory.id,
                    isActive: false
                })
            );
        });

        it('debería lanzar NotFoundException al eliminar categoría inexistente', async () => {
            categoryRepository.findOne.mockResolvedValue(null);

            await expect(service.remove('999', mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });

        it('debería poder hacer soft delete de una categoría ya inactiva', async () => {
            const alreadyInactiveCategory = { ...mockCategory, isActive: false };
            categoryRepository.findOne.mockResolvedValue(alreadyInactiveCategory);
            categoryRepository.save.mockResolvedValue(alreadyInactiveCategory);

            await service.remove(mockCategory.id, mockUser as User);

            expect(categoryRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    isActive: false
                })
            );
        });
    });
});