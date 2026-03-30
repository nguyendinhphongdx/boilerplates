import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/repositories/user.repository.js';
import { LoginDto, RegisterDto, TokenResponseDto } from '../dto/index.js';
import { JwtPayload } from '../interfaces/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const existing = await this.userRepository.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.generateTokens({ sub: user.id, email: user.email });
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateTokens({ sub: user.id, email: user.email });
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }

      return this.generateTokens({ sub: user.id, email: user.email });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(payload: JwtPayload): TokenResponseDto {
    const payloadObj = { sub: payload.sub, email: payload.email };
    return {
      accessToken: this.jwtService.sign(payloadObj, {
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn') as any,
      }),
      refreshToken: this.jwtService.sign(payloadObj, {
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') as any,
      }),
    };
  }
}
