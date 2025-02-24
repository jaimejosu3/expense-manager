import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { last } from 'rxjs';

describe('UserService', () => {
    let service: UserService;
    let userRepository: jest.Mocked<Repository<User>>;

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

    const mockUserResponse: Partial<User> = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isActive: true,
        createdAt: new Date()
    };

    beforeEach(async () => {
        const mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User));
    });

    describe('create', () => {
        const createUserDto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        it('debería crear un usuario correctamente', async () => {
            userRepository.findOne.mockResolvedValue(null);
            userRepository.create.mockReturnValue(mockUser);
            userRepository.save.mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(result).toEqual(mockUser);
            expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
            expect(userRepository.save).toHaveBeenCalled();
        });

        it('debería lanzar ConflictException si el email ya existe', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.create(createUserDto))
                .rejects
                .toThrow(ConflictException);
        });

        it('debería crear usuario con isActive true por defecto', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const userWithDefaultActive = { ...mockUser, isActive: true };
            userRepository.create.mockReturnValue(userWithDefaultActive);
            userRepository.save.mockResolvedValue(userWithDefaultActive);

            const result = await service.create(createUserDto);

            expect(result.isActive).toBe(true);
        });
    });

    describe('findAll', () => {
        it('debería retornar lista de usuarios', async () => {
            const mockUsers = [mockUser];
            userRepository.find.mockResolvedValue(mockUsers);

            const result = await service.findAll();

            expect(result).toEqual(mockUsers);
            expect(userRepository.find).toHaveBeenCalledWith({
                select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt']
            });
        });

        it('debería retornar array vacío si no hay usuarios', async () => {
            userRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('debería encontrar un usuario por ID', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne('1');
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt']
            });
        });

        it('debería lanzar NotFoundException cuando no existe el usuario', async () => {
            userRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999'))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('findByEmail', () => {
        it('debería encontrar un usuario por email incluyendo password', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findByEmail('john@example.com');

            expect(result).toEqual(mockUser);
            expect(result).toHaveProperty('password');
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: 'john@example.com' }
            });
        });

        it('debería retornar undefined cuando no existe el email', async () => {
            userRepository.findOne.mockResolvedValue(null);

            const result = await service.findByEmail('nonexistent@example.com');

            expect(result).toBeUndefined();
        });
    });

    describe('update', () => {
        const updateUserDto = {
            firstName: 'John Updated',
            lastName: 'Doe Updated'
        };

        it('debería actualizar un usuario correctamente', async () => {
            const updatedUser = { ...mockUserResponse, ...updateUserDto };
            userRepository.findOne.mockResolvedValue(mockUser);
            userRepository.save.mockResolvedValue(mockUser);

            const result = await service.update('1', updateUserDto);

            expect(result.firstName).toBe(updateUserDto.firstName);
            expect(result.lastName).toBe(updateUserDto.lastName);
        });

        it('debería lanzar NotFoundException al actualizar usuario inexistente', async () => {
            userRepository.findOne.mockResolvedValue(null);

            await expect(service.update('999', updateUserDto))
                .rejects
                .toThrow(NotFoundException);
        });
    });
});