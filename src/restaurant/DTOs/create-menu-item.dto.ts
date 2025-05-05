import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { FoodType } from '../entities/restaurant.entity';

export class CreateMenuItemDto {
  @IsString()
  item_name: string;

  @IsNumber()
  item_price: number;

  @IsEnum(FoodType)
  food_type: FoodType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}
