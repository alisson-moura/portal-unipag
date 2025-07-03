import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UserPayloadDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    senha: string,
  ): Promise<UserPayloadDto | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const senhaCorresponde = await bcrypt.compare(senha, user.senha);

    if (!senhaCorresponde) return null;

    return {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }

  login(user: UserPayloadDto) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }
}
