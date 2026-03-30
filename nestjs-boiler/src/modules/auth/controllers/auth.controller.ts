import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as express from 'express';
import { AuthService } from '../services/auth.service.js';
import { LoginDto, RegisterDto } from '../dto/index.js';
import { Public } from '../../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiAuth } from '../../../common/decorators/api-auth.decorator.js';
import type { RequestUser } from '../interfaces/index.js';

const COOKIE_OPTIONS: express.CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.register(registerDto);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Registered successfully' };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.login(loginDto);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Login successful' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token via cookie' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Res({ passthrough: true }) res: express.Response) {
    const cookies = (res.req as unknown as { cookies: Record<string, string> }).cookies;
    const refreshToken: string = cookies?.refresh_token ?? '';
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiAuth()
  @ApiOperation({ summary: 'Logout and clear cookies' })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
    return { message: 'Logged out' };
  }

  @Get('me')
  @ApiAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  getMe(@CurrentUser() user: RequestUser) {
    return user;
  }

  private setTokenCookies(
    res: express.Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000, // 15m
    });
    res.cookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }
}
