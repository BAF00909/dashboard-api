import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.service.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('Не удалось прочитать файл .env или он отсутствует');
		} else {
			this.loggerService.log('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
