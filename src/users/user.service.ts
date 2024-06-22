import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user.login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '@prisma/client';
import 'reflect-metadata';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepository) private userRepository: IUserRepository,
	) {}
	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		return await this.userRepository.create(newUser);
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const foundUser = await this.userRepository.find(email);
		if (foundUser) {
			const user = new User(foundUser.email, foundUser.name, foundUser.password);
			return await user.comparePassword(password);
		}
		return false;
	}
	async getUserByEmail(email: string): Promise<UserModel | null> {
		const foundUser = await this.userRepository.find(email);
		if (foundUser) {
			return foundUser;
		}
		return null;
	}
}
