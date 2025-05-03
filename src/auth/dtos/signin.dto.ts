import {
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phone: string;
}
