import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  fullName: string;
}
