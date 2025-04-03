import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}