import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private readonly smtp_mailer: string;
  private readonly smtp_password: string;
  private readonly smtp_host: string;
  private readonly smtp_port: number;
  private readonly transportOptions: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(private configService: ConfigService) {
    this.smtp_mailer = this.configService.get<string>('SMTP_MAILER');
    this.smtp_password = this.configService.get<string>('SMTP_PASSWORD');
    this.smtp_host = this.configService.get<string>('SMTP_HOST');
    this.smtp_port = this.configService.get<number>('SMTP_PORT');
    this.transportOptions = createTransport({
      host: this.smtp_host,
      port: this.smtp_port,
      secure: true,
      auth: {
        user: this.smtp_mailer,
        pass: this.smtp_password,
      },
    });
  }

  public sendTokenConfirmEmail(
    email: string,
    name: string,
    token: string,
  ): void {
    const link =
      this.configService.get<string>('DOMAIN') + '/valild_email?token=' + token;
    const html = `<h3>Hi ${name}, welcome to our app</h3></br>
                  <p>Your account have just been created without <b>active</b></p></br>
                  <p>To active this, please click <b>bellow</b></p></br>
                    <a style="font-weight: bold; margin: 10px 0;" href="${link}">Active Account</a></br>
                    <p style={{color: '#f00}}>Link will expired after 30 minutes</p>
    `;
    this.sendMail(email, 'Active your account', html);
  }

  public sendTokenConfirmResetPassword(
    email: string,
    name: string,
    token: string,
  ): void {
    const link =
      this.configService.get<string>('DOMAIN') +
      '/reset_password?token=' +
      token;
    const html = `<h3>Hi ${name}, welcome to our app</h3></br>
                  <p>Your code to reset password</p></br>
                  <div style="background-color:#ddd; border-radius: 4px; border: 1px solid #ccc; padding: 10px 25px">
                    <p style="font-weight: bold;">${link}</p></br>
                    <p style={{color: '#f00}}>Link will expired after 30 minutes</p>
                  </div>
    `;

    this.sendMail(email, 'Reset password in your account', html);
  }

  private sendMail(to: string, subject: string, html: string): void {
    this.transportOptions
      .sendMail({
        from: 'OVEN',
        to,
        subject,
        html,
      })
      .then(() => {
        console.log('SEND MAIL SUCCESSFULLY');
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });
  }
}
