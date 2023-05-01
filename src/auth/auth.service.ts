import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDTO } from 'src/users/dto/ChangePassword.dto';
import { ResetPasswordDTO } from 'src/users/dto/ResetPassword.dto';
import { SignInUserDTO } from 'src/users/dto/SigninUser.dto';
import { SignUpUserDTO } from 'src/users/dto/SignupUser.dto';
import { User } from 'src/users/users.entity';
import { ConfirmTokenDTO } from './dtos/ConfirmToken.dto';
import { ConfirmResetPasswordDTO } from './dtos/ConfirmResetPassword.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { ISignInResponse } from './interfaces/ISignInResponse';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interfaces/IJwtPayload';
import { TypeTokenEnum } from 'src/jwt/enums/TypeToken.eums';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}
  public async signUp(signUpUserDTO: SignUpUserDTO): Promise<boolean> {
    const user = await this.userService.createUser(signUpUserDTO);
    if (!user) throw new BadRequestException('Bad request');
    this.sendTokenValidMail(user);
    return true;
  }
  public async signIn(signInUserDTO: SignInUserDTO): Promise<ISignInResponse> {
    const { email, password } = signInUserDTO;
    const user = await this.userService.findUserByEmail(email);
    if (!user.valid) {
      this.sendTokenValidMail(user);
      throw new UnauthorizedException("Your acccount don't have actived yet");
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const access_token: string = await this.jwtService.generateTokenByType(
        TypeTokenEnum.ACCESS_TOKEN,
        user.id,
      );
      const refresh_token: string = await this.jwtService.generateTokenByType(
        TypeTokenEnum.REFRESH_TOKEN,
        user.id,
      );
      return { id: user.id, access_token, refresh_token };
    } else {
      throw new BadRequestException('Please check your username and password!');
    }
  }
  public async sendTokenValidMail(user: User): Promise<boolean> {
    if (!user.confirm_token) {
      const confirm_token = await this.jwtService.generateTokenByType(
        TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN,
        user.id,
      );
      await this.userService.addConfirmToken(user.id, confirm_token);
      this.mailerService.sendTokenConfirmEmail(
        user.email,
        user.name,
        confirm_token,
      );
      return true;
    } else {
      try {
        const { userId } = await this.jwtService.verifyTokenByType(
          TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN,
          user.confirm_token,
        );
        if (userId === user.id) {
          this.mailerService.sendTokenConfirmEmail(
            user.email,
            user.name,
            user.confirm_token,
          );
        }
      } catch (err) {
        const confirm_token = await this.jwtService.generateTokenByType(
          TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN,
          user.id,
        );
        await this.userService.addConfirmToken(user.id, confirm_token);
        this.mailerService.sendTokenConfirmEmail(
          user.email,
          user.name,
          confirm_token,
        );
      }
      return true;
    }
  }

  public async updateValidEmail(token: string): Promise<boolean> {
    const { userId } = await this.jwtService.verifyTokenByType(
      TypeTokenEnum.CONFIRM_VALID_EMAIL_TOKEN,
      token,
    );
    const result = await this.userService.updateValidEmail(userId);
    return result;
  }

  public async changePassword(
    changePasswordDTO: ChangePasswordDTO,
    userId: string,
  ): Promise<boolean> {
    const result = await this.userService.changePassword(
      changePasswordDTO,
      userId,
    );
    return result;
  }

  public async sendTokenResetPassword(
    confirmResetPasswordDTO: ConfirmResetPasswordDTO,
  ): Promise<boolean> {
    const { email } = confirmResetPasswordDTO;
    const user = await this.userService.findUserByEmail(email);
    if (!user.valid) {
      throw new UnauthorizedException(
        'Please active your account in your email',
      );
    } else if (!user.confirm_token) {
      const confirm_token = await this.jwtService.generateTokenByType(
        TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN,
        user.id,
      );
      await this.userService.addConfirmToken(user.id, confirm_token);
      this.mailerService.sendTokenConfirmResetPassword(
        user.email,
        user.name,
        confirm_token,
      );
    } else {
      try {
        const { userId } = await this.jwtService.verifyTokenByType(
          TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN,
          user.confirm_token,
        );
        if (userId === user.id) {
          this.mailerService.sendTokenConfirmResetPassword(
            user.email,
            user.name,
            user.confirm_token,
          );
        }
      } catch (err) {
        const confirm_token = await this.jwtService.generateTokenByType(
          TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN,
          user.id,
        );
        await this.userService.addConfirmToken(user.id, confirm_token);
        this.mailerService.sendTokenConfirmResetPassword(
          user.email,
          user.name,
          confirm_token,
        );
      }
    }
    return true;
  }
  public async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<boolean> {
    const { token, password } = resetPasswordDTO;
    const { userId } = await this.jwtService.verifyTokenByType(
      TypeTokenEnum.CONFIRM_RESET_PASSWORD_TOKEN,
      token,
    );
    const result = await this.userService.resetPassword(password, userId);
    return result;
  }
}
