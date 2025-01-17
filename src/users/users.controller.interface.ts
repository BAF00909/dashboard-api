import { NextFunction, Response, Request } from 'express';

export interface IUsersController {
	login(req: Request, res: Response, next: NextFunction): void;
	register(req: Request, res: Response, next: NextFunction): void;
	getUser(req: Request, res: Response, next: NextFunction): void;
}
