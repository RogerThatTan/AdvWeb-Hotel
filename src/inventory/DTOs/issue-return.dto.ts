import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class IssueItemDto
{
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    issued: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    employee_id: number;
}

export class ReturnItemDto
{
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    returned: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    employee_id: number;
}