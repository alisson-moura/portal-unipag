import { ApiProperty } from '@nestjs/swagger';
import { TaxaAdministrativa } from '@prisma/client';

export class TaxaAdministrativaDto implements TaxaAdministrativa {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID único da taxa administrativa.',
  })
  id: string;

  @ApiProperty({
    type: Number,
    description: 'Valor da taxa administrativa (ex: 0.0058 para 0.58%).',
    example: 0.0058,
  })
  taxa: any;

  @ApiProperty({
    description: 'Data da última atualização.',
    example: '2025-08-02T13:42:32.000Z',
  })
  atualizado_em: Date;
}

export class TaxaAdministrativaResponseDto {
  @ApiProperty({ type: () => TaxaAdministrativaDto })
  taxa_administrativa: TaxaAdministrativaDto;
}
