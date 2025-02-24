import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let userService: jest.Mocked<UserService>;
    let jwtService: jest.Mocked<JwtService>;

    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockUserWithoutPassword: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: false,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
    };

    beforeEach(async () => {
        const userServiceMock = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        };

        const jwtServiceMock = {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: userServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get(UserService);
        jwtService = module.get(JwtService);
    });

    describe('validateUser', () => {
        it('should return user without password when credentials are valid', async () => {
            userService.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('test@example.com', 'password123');
            expect(result).toEqual(mockUserWithoutPassword);
            expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        });

        it('should return null when user is not found', async () => {
            userService.findByEmail.mockResolvedValue(undefined);

            const result = await service.validateUser('test@example.com', 'password123');

            expect(result).toBeNull();
            expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should return null when password is invalid', async () => {
            userService.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('test@example.com', 'wrongpassword');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should return access token and user data when login is successful', async () => {
            jest.spyOn(service, 'validateUser').mockResolvedValue(mockUserWithoutPassword);

            const result = await service.login(loginDto);

            expect(result).toEqual({
                access_token: 'mock.jwt.token',
                user: {
                    id: mockUserWithoutPassword.id,
                    email: mockUserWithoutPassword.email,
                    firstName: mockUserWithoutPassword.firstName,
                    lastName: mockUserWithoutPassword.lastName,
                }
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                email: mockUserWithoutPassword.email,
                sub: mockUserWithoutPassword.id,
            });
        });

        it('should throw UnauthorizedException when credentials are invalid', async () => {
            jest.spyOn(service, 'validateUser').mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        const registerDto = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        };

        it('should create a new user and return access token and user data', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            userService.create.mockResolvedValue(mockUser);

            const result = await service.register(registerDto);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userService.create).toHaveBeenCalledWith({
                ...registerDto,
                password: 'hashedPassword',
            });
            expect(result).toEqual({
                access_token: 'mock.jwt.token',
                user: {
                    id: mockUserWithoutPassword.id,
                    email: mockUserWithoutPassword.email,
                    firstName: mockUserWithoutPassword.firstName,
                    lastName: mockUserWithoutPassword.lastName,
                },
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                email: mockUser.email,
                sub: mockUser.id,
            });
        });
    });
});