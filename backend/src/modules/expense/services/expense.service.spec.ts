import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { BudgetService } from '../../budget/services/budget.service';
import { CategoryService } from './category.service';
import { Expense } from '../entities/expense.entity';
import { User } from '../../user/entities/user.entity';
import { Category } from '../entities/category.entity';
import { Budget } from '../../budget/entities/budget.entity';

describe('ExpenseService', () => {
    let service: ExpenseService;
    let expenseRepository: jest.Mocked<Repository<Expense>>;
    let budgetService: jest.Mocked<BudgetService>;
    let categoryService: jest.Mocked<CategoryService>;

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
        description: 'Gastos en comida',
        color: '#FF5733',
        budget: 1000,
        isActive: true,
        userId: mockUser.id,
        expenses: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockBudget: Budget = {
        id: '1',
        name: 'Presupuesto mensual',
        amount: 1000,
        currentSpent: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        categoryId: mockCategory.id,
        userId: mockUser.id,
        category: mockCategory as Category,
        isRecurring: false,
        user: new User,
        alerts: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockExpense: Expense = {
        id: '1',
        description: 'Compra supermercado',
        amount: 150.50,
        date: new Date('2024-01-15'),
        categoryId: mockCategory.id,
        userId: mockUser.id,
        category: mockCategory as Category,
        createdAt: new Date(),
        updatedAt: new Date(),
        isRecurring: false,
        user: mockUser
    };

    beforeEach(async () => {
        const mockExpenseRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn()
        };

        const mockBudgetService = {
            findOneByCategoryAndDate: jest.fn(),
            addExpenseAmount: jest.fn(),
            removeExpenseAmount: jest.fn()
        };

        const mockCategoryService = {
            findOne: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpenseService,
                {
                    provide: getRepositoryToken(Expense),
                    useValue: mockExpenseRepository
                },
                {
                    provide: BudgetService,
                    useValue: mockBudgetService
                },
                {
                    provide: CategoryService,
                    useValue: mockCategoryService
                }
            ],
        }).compile();

        service = module.get<ExpenseService>(ExpenseService);
        expenseRepository = module.get(getRepositoryToken(Expense));
        budgetService = module.get(BudgetService);
        categoryService = module.get(CategoryService);
    });

    describe('create', () => {
        const createExpenseDto = {
            description: 'Compra supermercado',
            amount: 150.50,
            date: new Date('2024-01-15'),
            categoryId: mockCategory.id
        };

        it('debería crear un gasto exitosamente', async () => {
            budgetService.findOneByCategoryAndDate.mockResolvedValue(mockBudget);
            expenseRepository.create.mockReturnValue(mockExpense);
            expenseRepository.save.mockResolvedValue(mockExpense);

            const result = await service.create(createExpenseDto, mockUser as User);

            expect(result).toEqual(mockExpense);
            expect(budgetService.addExpenseAmount).toHaveBeenCalledWith(mockBudget.id, mockExpense.amount);
        });

        it('debería lanzar NotFoundException cuando no existe presupuesto', async () => {
            budgetService.findOneByCategoryAndDate.mockResolvedValue(undefined);
            categoryService.findOne.mockResolvedValue(mockCategory);
            expenseRepository.create.mockReturnValue(mockExpense);

            await expect(service.create(createExpenseDto, mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        const filters = {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            categoryId: mockCategory.id,
            minAmount: 100,
            maxAmount: 200
        };

        it('debería retornar gastos filtrados', async () => {
            expenseRepository.find.mockResolvedValue([mockExpense]);

            const result = await service.findAll(mockUser as User, filters);

            expect(result).toEqual([mockExpense]);
            expect(expenseRepository.find).toHaveBeenCalledWith({
                where: expect.any(Object),
                relations: ['category'],
                order: { date: 'DESC' }
            });
        });

        it('debería aplicar filtros de fecha correctamente', async () => {
            const dateFilters = {
                startDate: new Date('2024-01-01')
            };

            await service.findAll(mockUser as User, dateFilters);

            expect(expenseRepository.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        date: MoreThanOrEqual(dateFilters.startDate)
                    })
                })
            );
        });
    });

    describe('findOne', () => {
        it('debería encontrar un gasto por ID', async () => {
            expenseRepository.findOne.mockResolvedValue(mockExpense);

            const result = await service.findOne(mockExpense.id, mockUser as User);

            expect(result).toEqual(mockExpense);
        });

        it('debería lanzar NotFoundException cuando no existe el gasto', async () => {
            expenseRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999', mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        const updateDto = {
            amount: 200,
            categoryId: '2'
        };

        it('debería actualizar un gasto y recalcular presupuestos', async () => {
            const updatedExpense = { ...mockExpense, ...updateDto };
            const newBudget = { ...mockBudget, id: '2' };

            expenseRepository.findOne.mockResolvedValue(mockExpense);
            budgetService.findOneByCategoryAndDate.mockResolvedValueOnce(mockBudget)
                .mockResolvedValueOnce(newBudget);
            categoryService.findOne.mockResolvedValue({ ...mockCategory, id: '2' });
            expenseRepository.save.mockResolvedValue(updatedExpense);

            const result = await service.update(mockExpense.id, updateDto, mockUser as User);
            expect(budgetService.removeExpenseAmount).toHaveBeenCalledWith(mockBudget.id, 150.5);
            expect(budgetService.addExpenseAmount).toHaveBeenCalledWith(newBudget.id, updateDto.amount);
            expect(result).toEqual(updatedExpense);
        });

        it('debería lanzar NotFoundException cuando no existe el presupuesto nuevo', async () => {
            expenseRepository.findOne.mockResolvedValue(mockExpense);
            budgetService.findOneByCategoryAndDate.mockResolvedValueOnce(mockBudget)
                .mockResolvedValueOnce(undefined);

            await expect(service.update(mockExpense.id, updateDto, mockUser as User))
                .rejects
                .toThrow(NotFoundException);
        });
    });
});