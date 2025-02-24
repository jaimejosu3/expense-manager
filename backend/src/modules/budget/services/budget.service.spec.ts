import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { BudgetService } from '../../../modules/budget/services/budget.service';
import { Budget } from '../../../modules/budget/entities/budget.entity';
import { BudgetAlert } from '../../../modules/budget/entities/budget-alert.entity';
import { Category } from '../../../modules/expense/entities/category.entity';
describe('BudgetService', () => {
    let service: BudgetService;
    let budgetRepository: jest.Mocked<Repository<Budget>>;
    let budgetAlertRepository: jest.Mocked<Repository<BudgetAlert>>;

    const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
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
        budget: 1500,
        isActive: true,
        userId: mockUser.id,
        expenses: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockBudget: Budget = {
        id: '1',
        name: 'Presupuesto mensual de alimentación',
        description: 'Control de gastos mensuales en comida',
        amount: 1000,
        currentSpent: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        userId: mockUser.id,
        categoryId: mockCategory.id,
        category: mockCategory as Category,
        isRecurring: true,
        recurrenceType: 'monthly',
        user: mockUser as User,
        alerts: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const mockBudgetRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn()
        };

        const mockBudgetAlertRepository = {
            find: jest.fn(),
            save: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BudgetService,
                {
                    provide: getRepositoryToken(Budget),
                    useValue: mockBudgetRepository
                },
                {
                    provide: getRepositoryToken(BudgetAlert),
                    useValue: mockBudgetAlertRepository
                }
            ],
        }).compile();

        service = module.get<BudgetService>(BudgetService);
        budgetRepository = module.get(getRepositoryToken(Budget));
        budgetAlertRepository = module.get(getRepositoryToken(BudgetAlert));
    });

    describe('create', () => {
        const createBudgetDto = {
            name: 'Presupuesto mensual de alimentación',
            description: 'Control de gastos mensuales en comida',
            amount: 1000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            categoryId: mockCategory.id,
            isRecurring: true,
            recurrenceType: 'monthly' as 'monthly' | 'yearly'
        };

        it('debería crear un presupuesto correctamente con todos los campos', async () => {
            budgetRepository.create.mockReturnValue(mockBudget);
            budgetRepository.save.mockResolvedValue(mockBudget);

            const result = await service.create(createBudgetDto, mockUser as User);

            expect(result).toEqual(mockBudget);
            expect(budgetRepository.create).toHaveBeenCalledWith({
                ...createBudgetDto,
                userId: mockUser.id,
                currentSpent: 0
            });
        });
    });

    describe('findAll', () => {
        const filters = {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            categoryId: mockCategory.id,
            onlyActive: true
        };

        it('debería retornar lista de presupuestos con información completa', async () => {
            budgetRepository.find.mockResolvedValue([mockBudget]);

            const result = await service.findAll(mockUser as User, filters);

            expect(result[0]).toEqual(expect.objectContaining({
                id: mockBudget.id,
                name: mockBudget.name,
                amount: mockBudget.amount,
                currentSpent: mockBudget.currentSpent,
                categoryName: mockCategory.name,
                daysRemaining: expect.any(Number),
                percentageUsed: 50
            }));
        });
    });

    describe('findOneByCategoryAndDate', () => {
        it('debería encontrar un presupuesto activo por categoría y fecha', async () => {
            budgetRepository.findOne.mockResolvedValue(mockBudget);

            const result = await service.findOneByCategoryAndDate(
                mockCategory.id,
                new Date('2024-01-15'),
                mockUser as User
            );

            expect(result).toBeDefined();
            expect(result?.category.name).toBe(mockCategory.name);
        });

        it('debería manejar categorías inactivas', async () => {
            const inactiveCategory = { ...mockCategory, isActive: false };
            const budgetWithInactiveCategory = {
                ...mockBudget,
                category: inactiveCategory
            };

            budgetRepository.findOne.mockResolvedValue(budgetWithInactiveCategory);

            const result = await service.findOneByCategoryAndDate(
                inactiveCategory.id,
                new Date('2024-01-15'),
                mockUser as User
            );

            expect(result?.category.isActive).toBe(false);
        });
    });

    describe('update', () => {
        const updateDto = {
            name: 'Presupuesto actualizado',
            amount: 1500,
            isRecurring: true,
            recurrenceType: 'yearly' as 'monthly' | 'yearly'
        };

        it('debería mantener la relación con la categoría al actualizar', async () => {
            const updatedBudget = {
                ...mockBudget,
                ...updateDto,
                category: mockCategory
            };

            budgetRepository.findOne.mockResolvedValue(mockBudget);
            budgetRepository.save.mockResolvedValue(updatedBudget);

            const result = await service.update(mockBudget.id, updateDto, mockUser as User);

            expect(result.category).toBeDefined();
            expect(result.category.id).toBe(mockCategory.id);
        });
    });
});