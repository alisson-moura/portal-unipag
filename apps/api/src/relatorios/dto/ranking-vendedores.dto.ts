import { ApiProperty } from '@nestjs/swagger';

export class RankingVendedoresDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  mdr: number;
}
