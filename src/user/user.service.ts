import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashingProvider } from 'src/hash/hashing.provider';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashProvider: HashingProvider,
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
      return { message: 'User created successfully', user: newUser };
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
      return null;
    }
  }
}
