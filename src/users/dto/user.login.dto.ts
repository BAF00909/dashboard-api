import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Не корректно введен Email' })
	email: string;
	@IsString({ message: 'Не корректно введен пароль' })
	password: string;
}
