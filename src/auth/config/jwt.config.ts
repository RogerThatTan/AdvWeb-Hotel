import { registerAs } from '@nestjs/config';
export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    accessTokenExpire: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRE ?? '3600',
      10,
    ),
  };
});
