import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './DTOs/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post('submit')
    public async submitFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
        return await this.feedbackService.submitFeedback(createFeedbackDto);
    }

    @Get('all')
    public async getAllFeedback() {
        return await this.feedbackService.getAllFeedback();
    }
    @Get('user/:user_id')
    public async getFeedbackByUserId(@Body('user_id') userId: number) {
        return await this.feedbackService.getFeedbackByUserId(userId);
    }
    @Get('date/:date')
    public async getFeedbackByDate(@Body('date') date: Date) {
        return await this.feedbackService.getFeebackByDate(date);
    }

}
