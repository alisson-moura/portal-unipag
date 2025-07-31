import { ApiProperty } from '@nestjs/swagger';

/**
 * Descreve o status das transações para um único dia.
 */
export class TransacaoDiariaDto {
  @ApiProperty({
    description: 'A data a que o resumo se refere, no formato AAAA-MM-DD.',
    example: '2025-07-31',
  })
  Data: string;

  @ApiProperty({
    description: 'A quantidade de transações aprovadas neste dia.',
    example: 1279745,
  })
  Aprovadas: number;

  @ApiProperty({
    description: 'A quantidade de transações negadas neste dia.',
    example: 33672,
  })
  Negadas: number;

  @ApiProperty({
    description: 'A quantidade de transações com status pendente neste dia.',
    example: 0,
  })
  Pendentes: number;
}

/**
 * Descreve o objeto completo do resumo de transações por período.
 */
export class ResumoTransacoesPeriodoDto {
  @ApiProperty({
    description: 'Identificador do tipo de objeto retornado.',
    example: 'Bandeiras',
  })
  object: string;

  @ApiProperty({
    description: 'O percentual total de transações aprovadas no período.',
    example: '96.36',
  })
  percentualAprovadas: string;

  @ApiProperty({
    description: 'O percentual total de transações negadas no período.',
    example: '3.64',
  })
  percentualNegadas: string;

  @ApiProperty({
    description: 'Uma lista contendo o resumo diário de transações.',
    type: [TransacaoDiariaDto],
  })
  items: TransacaoDiariaDto[];
}
