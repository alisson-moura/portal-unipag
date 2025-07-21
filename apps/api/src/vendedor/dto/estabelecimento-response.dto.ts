import { ApiProperty } from '@nestjs/swagger';
import { EstabelecimentoCeoPag } from '@prisma/client';

export class EstabelecimentoResponseDto
  implements Partial<EstabelecimentoCeoPag>
{
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 12345 })
  ceo_pag_id: number;

  @ApiProperty({ example: '12.345.678/0001-99' })
  document_number: string;

  @ApiProperty({ example: 'Empresa Exemplo LTDA' })
  social_reason: string;

  @ApiProperty({ example: 'Nome Fantasia Exemplo' })
  name: string;

  @ApiProperty({ example: 1 })
  status: number;

  @ApiProperty({ example: 'ONE' })
  account_source: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', required: false })
  updated_at?: Date | null | undefined;
}
