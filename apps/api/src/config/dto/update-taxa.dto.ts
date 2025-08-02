import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaxaDto {
  @ApiProperty({
    description: 'O novo valor da taxa administrativa.',
    example: 0.01,
  })
  taxa: number;
}
