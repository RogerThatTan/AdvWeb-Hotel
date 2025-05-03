import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsStrongPassword()
  @MinLength(8)
  @IsNotEmpty()
  previousPassword: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(20)
  @IsPhoneNumber('BD')
  previousPhone: string;

  @IsOptional()
  @MinLength(11)
  @MaxLength(20)
  @IsPhoneNumber('BD')
  phone?: string;
}
