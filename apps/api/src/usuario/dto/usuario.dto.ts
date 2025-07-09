import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export type UserRole = $Enums.Role;

export class Usuario {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefone: string;

  senha: string;

  @ApiProperty({ enum: ['ADMINISTRADOR', 'VENDEDOR'] })
  role: UserRole;

  @ApiProperty()
  criado_em: Date;

  @ApiProperty()
  ativo: boolean;
}
