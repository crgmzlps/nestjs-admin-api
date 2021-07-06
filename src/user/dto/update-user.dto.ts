import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  first_name?: string;

  last_name?: string;

  @IsEmail()
  email?: string;
}
