import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { HTTPError } from '../errors/http-error.class';

export class GuardMiddleware implements IMiddleware {
	async execute({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		if (user) {
			return next();
		} else {
			next(new HTTPError(401, 'Пользователь не авторизован', 'GuardMiddleware'));
		}
	}
}
