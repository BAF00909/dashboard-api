import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { Response, Request, NextFunction } from 'express';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from './dto/user.login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';
import 'reflect-metadata';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILoggerService) logger: ILoggerService,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				method: 'get',
				path: '/user',
				func: this.getUser,
				middlewares: [new GuardMiddleware()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (result) {
			const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
			this.ok(res, { token: jwt });
		} else {
			return next(new HTTPError(401, 'Пользователь не авторизаван', 'login'));
		}
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (result) {
			this.ok(res, { name: result.name, email: result.email, id: result.id });
		} else {
			return next(new HTTPError(442, 'Такой пользователь уже существует'));
		}
	}

	async getUser(
		{ user }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.getUserByEmail(user);
		if (!result) {
			return next(new HTTPError(442, 'Такой пользователь уже существует'));
		}
		this.ok(res, { userName: result?.name, id: result?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
