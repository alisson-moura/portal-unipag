import { ApiProperty } from '@nestjs/swagger';

export class AtribuirGestorDto {
  @ApiProperty()
  estabelecimentoId: string;

  @ApiProperty()
  gestorId: string;
}
