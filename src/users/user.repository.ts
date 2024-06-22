import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import 'reflect-metadata';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
