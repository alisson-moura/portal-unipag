import {
  Controller,
  Post,
  Request,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { RequestLoginDto, ResponseLoginDto, UserPayloadDto } from './auth.dto';
import { LocalAuthGuard, Public } from './guards';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: RequestLoginDto })
  @ApiOkResponse({ type: ResponseLoginDto })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post('login')
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Request() req: { user: UserPayloadDto }) {
    return this.authService.login(req.user);
  }

  @ApiOkResponse({ type: UserPayloadDto })
  @ApiBearerAuth()
  @Get('perfil')
  getProfile(@Request() req: { user: UserPayloadDto }) {
    return req.user;
  }
}
