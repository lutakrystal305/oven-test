import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as JWT from 'jsonwebtoken';
import { IJwtPayload } from 'src/auth/interfaces/IJwtPayload';
import { TypeTokenEnum } from './enums/TypeToken.eums';

@Injectable()
export class JwtService {
  private readonly jwt_refresh_secret: string;
  private readonly jwt_refresh_expired: string;
  private readonly jwt_access_secret: string;
  private readonly jwt_access_expired: string;
  private readonly jwt_confirm_reset_password_expire: string;
  private readonly jwt_confirm_reset_password_secret: string;
  private readonly jwt_confirm_valid_email_expire: string;
  private readonly jwt_confirm_valid_email_secret: string;
  private readonly jwt_options: JWT.SignOptions;

  constructor(private configService: ConfigService) {
    this.jwt_refresh_secret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwt_refresh_expired =
      this.configService.get<string>('JWT_REFRESH_EXPIRE');
    this.jwt_access_secret =
      this.configService.get<string>('JWT_ACCESS_SECRET');
    this.jwt_access_expired =
      this.configService.get<string>('JWT_ACCESS_EXPIRE');
    this.jwt_confirm_reset_password_expire = this.configService.get<string>(
      'JWT_COFIRM_RESET_PASSWORD_EXPIRE',
    );
    this.jwt_confirm_reset_password_secret = this.configService.get<string>(
      'JWT_COFIRM_RESET_PASSWORD_SECRET',
    );
    this.jwt_confirm_valid_email_expire = this.configService.get<string>(
      'JWT_COFIRM_VALID_EMAIL_EXPIRE',
    );
    this.jwt_confirm_valid_email_secret = this.configService.get<string>(
      'JWT_COFIRM_VALID_EMAIL_SECRET',
    );
    this.jwt_options = {
      algorithm: 'HS256',
    };
  }

  private async generateToken(
    payload: IJwtPayload,
    secret_key: string,
    options: JWT.SignOptions,
  ): Promise<string> {
    return await JWT.sign(payload, secret_key, options);
  }

  private async verifyToken(
    token: string,
    secret_key: string,
    options: JWT.SignOptions,
  ): Promise<IJwtPayload> {
    try {
      const result = await JWT.verify(token, secret_key, options);
      return result;
    } catch (err) {
      if (err instanceof JWT.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else {
        throw new UnauthorizedException('Token invalid');
      }
    }
  }

  public async generateTokenByType(
    type: TypeTokenEnum,
    userId: string,
  ): Promise<string> {
    switch (type) {
      case TypeTokenEnum.ACCESS_TOKEN:
        return this.generateToken({ userId }, this.jwt_access_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_access_expired,
        });
      case TypeTokenEnum.REFRESH_TOKEN:
        return this.generateToken({ userId }, this.jwt_refresh_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_refresh_expired,
        });
      case TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN:
        return this.generateToken(
          { userId },
          this.jwt_confirm_reset_password_secret,
          {
            ...this.jwt_options,
            expiresIn: this.jwt_confirm_reset_password_expire,
          },
        );
      case TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN:
        return this.generateToken(
          { userId },
          this.jwt_confirm_valid_email_secret,
          {
            ...this.jwt_options,
            expiresIn: this.jwt_confirm_valid_email_expire,
          },
        );
    }
  }
  public async verifyTokenByType(
    type: TypeTokenEnum,
    token: string,
  ): Promise<IJwtPayload> {
    switch (type) {
      case TypeTokenEnum.ACCESS_TOKEN:
        return this.verifyToken(token, this.jwt_access_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_access_expired,
        });
      case TypeTokenEnum.REFRESH_TOKEN:
        return this.verifyToken(token, this.jwt_refresh_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_refresh_secret,
        });
      case TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN:
        return this.verifyToken(token, this.jwt_confirm_reset_password_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_confirm_reset_password_expire,
        });
      case TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN:
        return this.verifyToken(token, this.jwt_confirm_valid_email_secret, {
          ...this.jwt_options,
          expiresIn: this.jwt_confirm_valid_email_expire,
        });
    }
  }
}
