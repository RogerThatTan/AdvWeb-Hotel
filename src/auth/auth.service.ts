import { Injectable } from '@nestjs/common';
import { SignInProvider } from './signin.provider';
import { SignInDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
}
