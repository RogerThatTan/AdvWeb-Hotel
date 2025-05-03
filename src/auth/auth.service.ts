import { Injectable } from '@nestjs/common';
import { SignInProvider } from './signin.provider';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  async refreshToken(refreshToken: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshToken);
  }
}
