import { ApiProperty } from '@nestjs/swagger';

export class PeriodQueryDto {
  @ApiProperty({
    description: 'A data de início do período (formato: YYYY-MM-DD)',
    example: '2025-01-01',
    required: true, // Define se o parâmetro é obrigatório
  })
  start_date: string;

  @ApiProperty({
    description: 'A data final do período (formato: YYYY-MM-DD)',
    example: '2025-01-31',
    required: true,
  })
  finish_date: string;
}
