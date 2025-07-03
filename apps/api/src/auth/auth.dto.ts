import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/usuario/dto/usuario.dto';

export class RequestLoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  senha: string;
}

export class UserPayloadDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: ['ADMINISTRADOR', 'VENDEDOR'] })
  role: UserRole;
}

export class ResponseLoginDto extends UserPayloadDto {
  @ApiProperty()
  access_token: string;
}
