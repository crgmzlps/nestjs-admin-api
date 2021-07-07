import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  first_name?: string;

  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  role_id?: number;
}
