import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserService } from 'src/user/user.service';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly JwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly userService: UserService,
  ) {}
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { phone } = await this.JwtService.verifyAsync<
        Pick<ActiveUserData, 'phone'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userService.findUserByPhone(phone);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
