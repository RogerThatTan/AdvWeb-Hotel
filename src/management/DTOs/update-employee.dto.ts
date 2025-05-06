import { IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { EmployeeRole, EmployeeStatus } from "./create-employee.dto";

export class UpdateEmployeeDto
{
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(EmployeeRole)
    role?: EmployeeRole;

    @IsOptional()
    @IsString()
    @IsPhoneNumber('BD')
    phone?: string;

    //@IsOptional()
    //@IsString()
    //nid?: string;

    @IsOptional()
    hire_date?: Date;

    @IsOptional()
    @IsEnum(EmployeeStatus)
    status?: EmployeeStatus;
}