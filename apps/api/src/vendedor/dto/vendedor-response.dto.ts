import { ApiProperty } from '@nestjs/swagger';
import { Role, Usuario } from '@prisma/client';

export class VendedorResponseDto implements Partial<Usuario> {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  nome: string;

  @ApiProperty({ example: 'joao.silva@example.com' })
  email: string;

  @ApiProperty({ example: '11987654321', nullable: true })
  telefone: string | null;

  @ApiProperty({ enum: Role, example: Role.VENDEDOR })
  role: Role;

  @ApiProperty()
  criado_em: Date;

  @ApiProperty({ example: true })
  ativo: boolean;
}
