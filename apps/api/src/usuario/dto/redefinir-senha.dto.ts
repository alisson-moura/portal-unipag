import { ApiProperty } from '@nestjs/swagger';

export class RedefinirSenhaDto {
  @ApiProperty()
  senha: string;
}
