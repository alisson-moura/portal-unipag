import { ApiProperty, OmitType, IntersectionType } from '@nestjs/swagger';
import { Usuario } from './usuario.dto';

export class CreateUsuarioDto extends IntersectionType(
  OmitType(Usuario, ['id', 'criado_em', 'ativo']),
) {
  @ApiProperty()
  senha: string;
}
