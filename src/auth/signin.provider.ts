import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingProvider } from 'src/hash/hashing.provider';
import { UserService } from 'src/user/user.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { SignInDto } from './dtos/signin.dto';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly userService: UserService,
    private readonly hashProvider: HashingProvider,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signIn(signInDto: SignInDto) {
    let user = await this.userService.findUserByPhone(signInDto.phone);
    if (!user) {
      return { message: 'User not found' };
    }
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      return { message: 'Error comparing password', error };
    }

    if (!isEqual) {
      return { message: 'Password is incorrect' };
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.user_id,
        phone: user.phone,
        role: user.role,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenExpire,
        secret: this.jwtConfiguration.secret,
      },
    );
    return accessToken;
  }
}
