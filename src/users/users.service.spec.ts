import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const UsersRepository: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(UsersRepository);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
	usersService = container.get<IUserService>(TYPES.IUserService);
});
let createdUser: UserModel | null;
describe('UserService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: 'Test',
				email: 'test@test.com',
				password: '123',
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			name: 'Test',
			email: 'test@test.com',
			password: '123',
		});
		expect(createdUser?.id).toBe(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('Validation - Success', () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = usersService.validateUser({
			email: 'test@test.com',
			password: '123',
		});
		expect(result).toBeTruthy();
	});

	it('Validation - wrong', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: 'test@test.com',
			password: '1233',
		});
		expect(result).toBeFalsy();
	});

	it('Validation - wrong user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({
			email: 'test@test.com',
			password: '123',
		});
		expect(result).toBeFalsy();
	});
});
