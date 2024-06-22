import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.conteroller';
import { ILoggerService } from './logger/logger.interface';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUsersController } from './users/users.controller.interface';
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './users/user.repository.interface';
import { UserRepository } from './users/user.repository';

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
