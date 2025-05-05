import { IsNumber } from 'class-validator';

export class PlaceOrderDto {
    @IsNumber()
    bookingId: number;

    @IsNumber()
    foodId: number;

    @IsNumber()
    quantity: number;

    @IsNumber()
    employeeId: number;
}
