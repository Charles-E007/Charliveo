import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Veuillez fournir un email valide' })
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}