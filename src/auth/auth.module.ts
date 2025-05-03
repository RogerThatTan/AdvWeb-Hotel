import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ManagementModule } from '../management/management.module';
import { UserModule } from '../user/user.module';
import { SignInProvider } from './signin.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { HashModule } from 'src/hash/hash.module';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SignInProvider, GenerateTokensProvider, RefreshTokensProvider],
  exports: [AuthService],
  imports: [
    ManagementModule,
    UserModule,
    HashModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
