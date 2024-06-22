import express, { Express } from 'express';
import { Server } from 'node:http';
import { UserController } from './users/users.conteroller';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILoggerService } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './users/user.repository.interface';
import { AuthMiddleware } from './common/auth.middleware';
import 'reflect-metadata';

@injectable()
export class App {
	port: number;
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private loggerService: ILoggerService,
		@inject(TYPES.IUsersController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.IUserRepository) private userRepository: IUserRepository,
	) {
		this.app = express();
		this.port = 8000;
		this.loggerService = loggerService;
		this.userController = userController;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.prismaService.connect();
		this.server = this.app.listen(this.port, () => {
			this.loggerService.log(`Сервер запущен по адресу: http://localhost:${this.port}`);
		});
	}
}
