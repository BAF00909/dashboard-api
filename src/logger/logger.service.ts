import { Logger, ILogObj } from 'tslog';
import { ILoggerService } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILoggerService {
	public logger: Logger<ILogObj>;
	constructor() {
		this.logger = new Logger<ILogObj>({
			prettyLogTemplate:
				'{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{name}}\t',
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
