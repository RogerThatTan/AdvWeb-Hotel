import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(phone_no: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        phone: phone_no,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.phone,
        this.jwtConfiguration.accessTokenExpire,
        {
          sub: user.user_id,
          role: user.role,
        },
      ),

      this.signToken(user.phone, this.jwtConfiguration.refreshTokenExpire),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
