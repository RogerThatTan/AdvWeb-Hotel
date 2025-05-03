import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class CreateInventoryDto
{
    @IsNotEmpty()
    @IsString()
    item_name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    employee_id: number;
}