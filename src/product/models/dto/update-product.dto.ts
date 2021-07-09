import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
