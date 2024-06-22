import { ILogObj, Logger } from 'tslog';

export interface ILoggerService {
	logger: Logger<ILogObj>;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
