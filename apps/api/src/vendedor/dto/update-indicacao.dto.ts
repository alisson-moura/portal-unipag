import { ApiProperty } from '@nestjs/swagger';

export class UpdateIndicacaoDto {
  @ApiProperty({
    description: 'Nova taxa de comissão (percentual) para a indicação.',
    example: 4.0,
  })
  taxa_comissao: number;
}
