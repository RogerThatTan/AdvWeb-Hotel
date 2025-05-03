import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(20)
  @IsPhoneNumber('BD')
  phone: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(5)
  address: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  nid: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  passport: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  nationality: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  Profession: string;

  @IsInt()
  @Min(0)
  @Max(120)
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  @IsBoolean()
  maritalStatus: boolean;

  @IsOptional()
  @MaxLength(50)
  @MinLength(5)
  vehicleNo?: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  fatherName: string;

  @IsOptional()
  registrationDate?: Date;
}
