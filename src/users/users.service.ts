import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignUpUserDTO } from './dto/SignupUser.dto';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from './dto/ChangePassword.dto';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  public async findUserById(userId: string): Promise<User> {
    const user = await this.repository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException(`User not found by userId: ${userId}`);
    }
    return user;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(`User not found by email: ${email}`);
    }
    return user;
  }

  public async createUser(signUpUserDTO: SignUpUserDTO): Promise<User> {
    const { name, email, password } = signUpUserDTO;

    const existUser = await this.repository.findOneBy({ email });

    if (existUser) {
      if (!existUser.valid)
        throw new BadRequestException(
          'Your account created but dont have activated yet, pls check your mail',
        );
      throw new BadRequestException('Email is already exists');
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.repository.create({
        name,
        email,
        password: hashedPassword,
      });

      await this.repository.save(user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async addConfirmToken(userId: string, token: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user)
      throw new NotFoundException(`Can not find user by userId: ${userId}`);
    try {
      user.confirm_token = token;
      await this.repository.save(user);
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(
    changePasswordDTO: ChangePasswordDTO,
    userId: string,
  ): Promise<boolean> {
    const { oldPassword, newPassword } = changePasswordDTO;

    const user = await this.repository.findOneBy({ id: userId });
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await this.repository.save(user);
      return true;
    } else {
      throw new BadRequestException('Current Password was incorrect!');
    }
  }

  public async resetPassword(
    newPassword: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.repository.findOneBy({ id: userId });
    if (!user)
      throw new NotFoundException(`Can not find user by userId: ${userId}`);
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await this.repository.save(user);
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async updateValidEmail(userId: string): Promise<boolean> {
    const user = await this.repository.findOneBy({ id: userId });
    if (!user)
      throw new NotFoundException(`Can not find user by userId: ${userId}`);
    try {
      user.valid = true;
      await this.repository.save(user);
      this.removeConfirmToken(userId);
      return true;
    } catch (err) {
      throw err;
    }
  }

  private async removeConfirmToken(userId: string): Promise<void> {
    try {
      const user = await this.repository.findOneBy({ id: userId });
      if (!user)
        throw new NotFoundException(`Can not find user by userId: ${userId}`);
      user.confirm_token = null;
      await this.repository.save(user);
    } catch (err) {
      throw err;
    }
  }
}
