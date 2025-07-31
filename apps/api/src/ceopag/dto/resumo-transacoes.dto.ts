import { ApiProperty } from '@nestjs/swagger';

export class DetalheFaturamentoDto {
  @ApiProperty({
    description: 'O valor monetário total, representado em centavos.',
    example: 5243115,
  })
  valor: number;

  @ApiProperty({
    description: 'A quantidade de transações correspondentes.',
    example: 669,
  })
  qtde: number;
}

/**
 * DTO que agrupa os diferentes tipos de faturamento.
 */
export class DadosFaturamentoDto {
  @ApiProperty({
    description: 'Dados consolidados do faturamento total.',
    type: DetalheFaturamentoDto,
  })
  total: DetalheFaturamentoDto;

  @ApiProperty({
    description: 'Dados referentes às transações de débito.',
    type: DetalheFaturamentoDto,
  })
  debito: DetalheFaturamentoDto;

  @ApiProperty({
    description: 'Dados referentes às transações de crédito à vista.',
    type: DetalheFaturamentoDto,
  })
  credito: DetalheFaturamentoDto;

  @ApiProperty({
    description: 'Dados referentes às transações de crédito parcelado.',
    type: DetalheFaturamentoDto,
  })
  parcelado: DetalheFaturamentoDto;
}

/**
 * DTO principal que representa o corpo (body) da requisição ou resposta.
 */
export class ResumoTransacoesDto {
  @ApiProperty({
    description: 'O objeto principal que contém o resumo do faturamento.',
    type: DadosFaturamentoDto,
  })
  Faturamento: DadosFaturamentoDto;
}
