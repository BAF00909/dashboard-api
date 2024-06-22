import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[PrismaService] Успешо подключено к бд');
		} catch (error) {
			if (error instanceof Error) {
				this.loggerService.error('[PrismaService] Ошибка подключения к бд ' + error.message);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
