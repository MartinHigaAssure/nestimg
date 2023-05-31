import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  UseGuards,
  Req,
  UploadedFile, 
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import * as cookie from 'cookie';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { url } from 'inspector';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { MulterFile } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  /*@Post('login')
  signIn(@Body() signInDto: UpdateUserDto,@Res({passthrough:true}) res:Response) {
    const u=signInDto.username;
    const p=signInDto.password;
    return this.authService.signIn(u, p);
    //return { user: u, pass: p };
  }*/

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async signIn(@Req() req,@Body() signInDto: UpdateUserDto,@Res({passthrough:true}) res:Response) {
    const u=signInDto.username;
    const p=signInDto.password;
    const jwtToken = await this.authService.getToken(u,p);
    const secretData = {
      accessToken: jwtToken['access_token'],
      refreshToken: "wCH7PEZy1AbvsASAPyM9qo7Bus3qqy"
    }; // Aquí debes proporcionar el valor que deseas asignar a la cookie

    // Crear la cookie con la configuración deseada
    //const security = await this.authService.getSecurity(u,p);
    //const secretData =  jwtToken['access_token']; // Aquí debes proporcionar el valor que deseas asignar a la cookie
    const cookieOptions: cookie.CookieSerializeOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 86409000),
    };
    const cookieString = cookie.serialize('auth-cookie', secretData, cookieOptions);

    // Establecer la cookie en la respuesta
    //res.setHeader('Set-Cookie', cookieString);
    res.cookie('auth-cookie', secretData, cookieOptions);
    if(jwtToken){
      return  {
        access_token: res.getHeader('Set-Cookie'),
      };
    }else{
      return {
        access_token: 'jwtToken',
      };
    }
    //return { user: u, pass: p };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getHello(@Req() req) {
    return this.authService.signIn("john", "changeme");
  }


  @Get('email')
  getEmail() {
    const url="http://duckduckgo.com";
    const correo = 'adamwest872@gmail.com';
    return this.authService.email(correo, url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('resa')
  getHelle() {
    return "johnchangeme";
  }

  @Get()
  setCookie(@Res() res: Response) {
    const secretData = 'valor_secreto'; // Aquí debes proporcionar el valor que deseas asignar a la cookie

    // Crear la cookie con la configuración deseada
    const cookieOptions: cookie.CookieSerializeOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 86409000),
    };
    const cookieString = cookie.serialize('auth-cookie', secretData, cookieOptions);

    // Establecer la cookie en la respuesta
    res.setHeader('Set-Cookie', cookieString);

    return 'Cookie establecida exitosamente';
  }

  @Get('logout')
  async logout(@Res({passthrough:true}) res:Response){
    res.clearCookie('auth-cookie');
    return {msg:"success"};
  }

  @Post('imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  async cargarImagen(@UploadedFile() file:  MulterFile): Promise<string> {
    const nombreArchivo = `${Date.now()}-${file.originalname}`;
    const rutaCarpeta = 'img';
    const rutaArchivo = `${rutaCarpeta}/${nombreArchivo}`;

    // Verificar si la carpeta 'img' existe, de lo contrario, crearla
    if (!existsSync(rutaCarpeta)) {
      mkdirSync(rutaCarpeta);
    }

    // Guardar la imagen en la carpeta 'img'
    const stream = createWriteStream(rutaArchivo);
    stream.write(file.buffer);
    stream.end();

    const urlImagen = `http://localhost:3000/${rutaArchivo}`; // URL completa de la imagen

    // Guardar la URL de la imagen en la propiedad 'persona.perfil'
    // Aquí debes implementar tu lógica para guardar la URL en el objeto 'persona'

    return urlImagen;
  }
}

