import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as nodemailer from 'nodemailer';
@Injectable()
export class AuthService {
  
  async email(to, url) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com',
      port: 25,
      secure: false,
      auth: {
        user: '',
        pass: '',
      },
    });
    const mailOptions = {
      from: '',
      to: to,
      subject: '¿Qué haces?',
      text: 'Hola, ' +to+'  xd /n has click al este enlace para recuperar tu contraseña '+  url,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
    
  }
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username, pass) {
    const user = await this.usersService.signin(username, pass);
    if (user) {
      const payload = { username: user.username, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
      //
    } else {
      throw new UnauthorizedException();
     /* return {
        access: 'denied',
      };*/
    }
  }
  async validateUser(username, pass) {
    const user = await this.usersService.signin(username, pass);
   
      return user
   
  }
  async getToken(username, pass) {
    
    const user = await this.usersService.signin(username, pass);
    if (user) {
      const payload = { username: user.username, sub: user.id };
      return this.jwtService.sign(payload);
      /*return {
        access_token: await this.jwtService.signAsync(payload),
      };*/
      //
    } else {
      throw new UnauthorizedException();
     /* return {
        access: 'denied',
      };*/
    }
    //return this.jwtService.sign(user);
  }
  getHello(): string {
    return 'Hello World!';
  }
}

