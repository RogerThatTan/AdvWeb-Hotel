import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashingProvider } from 'src/hash/hashing.provider';
import { UpdateUserDto } from './dtos/update-user.dto';
import { EmailService } from 'src/email/email.service'; // Add this import
import { join } from 'path';
import { readFileSync } from 'fs';
import * as ejs from 'ejs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashProvider: HashingProvider,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  // Create User----------------------------------------------------
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    let validUser = createUserDto;
    validUser.registrationDate = new Date();
    validUser.password = await this.hashProvider.hashPassword(
      createUserDto.password,
    );
    try {
      const newUser = this.userRepository.create(validUser);
      await this.userRepository.save(newUser);
      if (newUser.email) {
        await this.sendWelcomeEmail(newUser.email, createUserDto);
      }
      return { user: newUser };
    } catch (error) {
      return { message: 'Error creating user', error };
    }
  }

  // Update User----------------------------------------------------
  public async updateUser(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { phone: updateUserDto.previousPhone },
    });

    if (!user) {
      return { message: 'User not found' };
    }
    const existingPassword = await this.hashProvider.comparePassword(
      updateUserDto.previousPassword,
      user.password,
    );

    if (!existingPassword) {
      return { message: 'password is incorrect' };
    }

    if (updateUserDto.phone) {
      const existPhone = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      });
      if (existPhone) {
        return { message: 'Phone number already exists' };
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashProvider.hashPassword(
        updateUserDto.password,
      );
    }
    Object.assign(user, updateUserDto);

    try {
      await this.userRepository.save(user);
      return { message: 'User updated successfully', user };
    } catch (error) {
      return { message: 'Error updating user', error };
    }
  }

  // Find User By Phone----------------------------------------------------
  public async findUserByPhone(phone: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phone: phone },
      });

      return user ? user : null;
    } catch (error) {
      return error;
    }
  }

  // Welcome Mail----------------------------------------------------

  private async sendWelcomeEmail(email: string, createUserDto?: CreateUserDto) {
    try {
      const possiblePaths = [
        join(process.cwd(), 'src', 'email', 'templates', 'welcome.ejs'),
        join(process.cwd(), 'dist', 'email', 'templates', 'welcome.ejs'),
        join(__dirname, '..', '..', 'email', 'templates', 'welcome.ejs'),
      ];
      let template;
      for (const path of possiblePaths) {
        try {
          console.log('Trying path:', path);
          template = readFileSync(path, 'utf8');
          break;
        } catch (e) {
          continue;
        }
      }
      if (!template) {
        throw new Error('Template not found in any location');
      }
      const html = ejs.render(template, {
        username: createUserDto?.name,
      });
      await this.emailService.sendEmail({
        recipients: [email],
        subject: 'Welcome to Amin Hotel',
        html: html,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      await this.emailService.sendEmail({
        recipients: [email],
        subject: 'Welcome to Our Service!',
        html: `<p>Welcome ${email.split('@')[0]}!</p>`,
      });
    }
  }
}
