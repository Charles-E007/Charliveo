import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateMonitorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({}, { message: 'Veuillez fournir une URL valide' })
  url: string;

  @IsEnum(['GET', 'POST', 'HEAD', 'PUT'])
  @IsOptional()
  method?: string;

  @IsInt()
  @Min(1)
  @Max(60)
  @IsOptional()
  intervalMinutes?: number;

  @IsOptional()
  headers?: Record<string, string>;

  @IsString()
  @IsOptional()
  body?: string;
}