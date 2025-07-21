import { ApiProperty } from '@nestjs/swagger';

export class CreateIndicacaoDto {
  @ApiProperty({
    description: 'UUID do estabelecimento que está sendo indicado.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  estabelecimento_id: string;

  @ApiProperty({
    description:
      'Taxa de comissão (percentual) para o vendedor sobre este estabelecimento.',
    example: 3.75,
  })
  taxa_comissao: number;
}
