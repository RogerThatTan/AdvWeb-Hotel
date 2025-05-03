import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class UpdateInventoryDto
{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    order_price: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    employee_id: number;
}