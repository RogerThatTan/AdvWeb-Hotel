import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderItemDto
{
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    quantity: number;
    
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    order_price: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    employee_id: number;
}