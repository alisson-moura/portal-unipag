import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  async validate(
    email: string,
    senha: string,
  ): Promise<{ id: string; role: string; email: string }> {
    const user = await this.authService.validateUser(email, senha);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
