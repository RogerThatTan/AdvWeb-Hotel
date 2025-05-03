import { registerAs } from '@nestjs/config';
export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    accessTokenExpire: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRES ?? '3600',
      10,
    ),
    refreshTokenExpire: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXPIRES ?? '86400',
      10,
    ),
  };
});
