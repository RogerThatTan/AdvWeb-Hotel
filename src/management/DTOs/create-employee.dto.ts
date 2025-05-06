import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export enum EmployeeRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    RECEPTIONIST = 'receptionist',
    FLOOR_MANAGER = 'floor_manager',
    RESTAURANT_RECEPTIONIST = 'restaurant_receptionist',
    CLERK = 'clerk',
    CLEANER = 'cleaner',
    WAITER = 'waiter',
    CHEF = 'chef',
    SECURITY_GUARD = 'security_guard',
    HOUSEKEEPING_STAFF = 'housekeeping_staff',
  }
  
  export enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ON_LEAVE = 'on_leave',
  }

  export class CreateEmployeeDto
  {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(EmployeeRole)
    role: EmployeeRole;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('BD')
    phone: string;

    @IsOptional()
    @IsString()
    nid?: string;

    @IsNotEmpty()
    hire_date: Date;

    @IsEnum(EmployeeStatus)
    @IsNotEmpty()
    status: EmployeeStatus = EmployeeStatus.ACTIVE;
  }