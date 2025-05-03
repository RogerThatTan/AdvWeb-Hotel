import { IsNotEmpty, IsNumber } from "class-validator"; 

export class CreateFeedbackDto
{
    @IsNotEmpty()
    feedback: string;

    @IsNumber()
    user_id: number;
}