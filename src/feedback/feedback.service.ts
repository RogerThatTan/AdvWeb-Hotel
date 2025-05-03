import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateFeedbackDto } from './DTOs/create-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private readonly feedbackRepository: Repository<Feedback>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async submitFeedback(createFeedbackDto: CreateFeedbackDto) {
        const user = await this.userRepository.findOneBy({ user_id: createFeedbackDto.user_id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const feedback = this.feedbackRepository.create(createFeedbackDto);
        feedback.user = user;
        return await this.feedbackRepository.save(feedback);
    }

    async getAllFeedback() {
        return await this.feedbackRepository.find({ relations: ['user'] });
    }

    async getFeedbackByUserId(userId: number) {
        const feedback = await this.feedbackRepository.find({
            where: { user: { user_id: userId } },
            relations: ['user'],
        });
        if (!feedback) {
            throw new NotFoundException('Feedback not found for this user');
        }
        return feedback;
    }

    async getFeebackByDate(date: Date)
    {
        const feedback = await this.feedbackRepository.find({
            where: { date: date },
            relations: ['user'],
        });
        if (!feedback) {
            throw new NotFoundException('Feedback not found for this date');
        }
        return feedback;
    }
}
