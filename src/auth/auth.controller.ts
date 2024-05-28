import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth() {
    return { data: 'Auth Controller' };
  }

  @Post('login/email')
  loginEmail(
    @Headers('Authorization') rowToken: string,
    @Headers() headers: any,
  ) {
    console.log('rowToken', rowToken, headers);

    const token = this.authService.extractTokenFromHeader(rowToken, 'Basic');

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('join/email')
  joinEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail({ email, password, nickname });
  }

  @Post('token/access')
  postTokenAccess(@Headers('Authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, 'Bearer');

    return {
      accessToken: this.authService.rotateToken(token, 'access'),
    };
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('Authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, 'Bearer');

    return {
      refreshToken: this.authService.rotateToken(token, 'refresh'),
    };
  }
}
