import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '@/users/entites/users.entity';
import { UsersService } from '@/users/users.service';
import { TypeSafeConfigService } from '@/config/config.service';

import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: TypeSafeConfigService,
  ) {}

  signToken(
    user: Pick<UsersModel, 'email' | 'id'>,
    type: 'access' | 'refresh' = 'access',
  ) {
    const payload = {
      email: user.email,
      sub: user.id,
      type,
    };

    return this.jwtService.sign(payload, {
      expiresIn: type === 'refresh' ? '7d' : '1h',
      secret: this.configService.get('jwt.secert'),
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user);
    const refreshToken = this.signToken(user, 'refresh');

    return {
      accessToken,
      refreshToken,
    };
  }

  async authenticateWithEmailandPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    const comparePassword = await bycrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!comparePassword) throw new UnauthorizedException('Invalid password');

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailandPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    const hash = await bycrypt.hash(
      user.password,
      this.configService.get('hash.time'),
    );

    const newUser = await this.usersService.create({ ...user, password: hash });

    return this.loginUser(newUser);
  }

  extractTokenFromHeader(header: string, tokenType: 'Bearer' | 'Basic') {
    const [type, token, ...rest] = header.split(' ');

    if (rest.length > 0 || type != tokenType || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

    const [email, password, ...rest] = decoded.split(':');

    if (rest.length > 0 || !email || !password) {
      throw new UnauthorizedException('Invalid token');
    }

    return { email, password };
  }

  verifiyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('jwt.secert'),
    });
  }

  rotateToken(token: string, isRefreshToken: 'access' | 'refresh' = 'access') {
    const decoded = this.verifiyToken(token);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        'token 갱신은 refresh token으로만 가능합니다',
      );
    }

    return this.signToken({ ...decoded }, isRefreshToken);
  }
}
