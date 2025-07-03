import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { EstabelecimentoDto } from './estabelecimento.dto';

export class RecebimentosQueryDto {
  start_date: string;
  finish_date: string;
  page?: number;
}

export class TotaisDto {
  @ApiProperty()
  mdr: number;
  @ApiProperty()
  tpv: number;
  @ApiProperty()
  rav: number;
  @ApiProperty()
  liquido: number;
}

export class RecebimentosDto extends IntersectionType(
  TotaisDto,
  EstabelecimentoDto,
) {}

export class VendedorRecebimentosDto {
  @ApiProperty({ type: TotaisDto })
  totais: TotaisDto;

  @ApiProperty({ type: RecebimentosDto, isArray: true })
  recebimentos: RecebimentosDto[];
}

export class DailyTotal extends IntersectionType(TotaisDto) {
  @ApiProperty()
  data_recebimento: string;
}

export class EstabelecimentoRecebimentosDto {
  @ApiProperty({ type: TotaisDto })
  totais: TotaisDto;

  @ApiProperty({ type: DailyTotal, isArray: true })
  recebimentos: DailyTotal[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  next_page: number;

  @ApiProperty()
  per_page: number;
}
