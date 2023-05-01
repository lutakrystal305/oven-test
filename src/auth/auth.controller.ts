import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDTO } from 'src/users/dto/SignupUser.dto';
import { SignInUserDTO } from 'src/users/dto/SigninUser.dto';
import { ISignInResponse } from './interfaces/ISignInResponse';
import { HttpExceptionFilter } from 'src/exception/HttpExceptionFilter';
import { ConfirmTokenDTO } from './dtos/ConfirmToken.dto';
import { ChangePasswordDTO } from 'src/users/dto/ChangePassword.dto';
import { ConfirmResetPasswordDTO } from './dtos/ConfirmResetPassword.dto';
import { ResetPasswordDTO } from 'src/users/dto/ResetPassword.dto';
import { AuthGuard } from './auth.guard';
import { GetUserId } from 'src/users/get-user.decorator';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  public async signUp(@Body() signUpUserDTO: SignUpUserDTO): Promise<any> {
    const result = await this.authService.signUp(signUpUserDTO);
    if (result) {
      return {
        message:
          'Your account have just been created, you can please active them',
      };
    }
  }

  @Post('signIn')
  public async signIn(
    @Body() signInUserDTO: SignInUserDTO,
  ): Promise<ISignInResponse> {
    const result = await this.authService.signIn(signInUserDTO);
    return result;
  }

  @Patch('/validEmail/:token')
  public async updateValidEmail(@Param('token') token: string): Promise<any> {
    const result = await this.authService.updateValidEmail(token);
    if (result) {
      return { message: 'Your account have just been actived' };
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/changePassword')
  public async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @GetUserId() userId: string,
  ): Promise<any> {
    const result = await this.authService.changePassword(
      changePasswordDTO,
      userId,
    );
    if (result) {
      return { message: 'You have just changed password successfully!' };
    }
  }

  @Post('/confirmResetPassword')
  public async sendTokenResetPassword(
    @Body() confirmResetPasswordDTO: ConfirmResetPasswordDTO,
  ): Promise<any> {
    const result = await this.authService.sendTokenResetPassword(
      confirmResetPasswordDTO,
    );
    if (result) {
      return {
        message:
          'We have just send token to your email, please get mail and active them',
      };
    }
  }

  @Patch('/resetPassword')
  public async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<any> {
    const result = await this.authService.resetPassword(resetPasswordDTO);
    if (result) {
      return {
        message: 'You have just reseted password successfully!',
      };
    }
  }
}
