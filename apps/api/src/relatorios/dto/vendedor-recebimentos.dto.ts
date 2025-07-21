import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { EstabelecimentoDto } from 'src/estabelecimentos/dto/estabelecimento.dto';

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

export class RecebimentosDto extends IntersectionType(TotaisDto) {
  @ApiProperty({ type: EstabelecimentoDto })
  estabelecimento: EstabelecimentoDto;
}

export class VendedorRecebimentosDto {
  @ApiProperty({ type: TotaisDto })
  totais: TotaisDto;

  @ApiProperty({ type: RecebimentosDto, isArray: true })
  recebimentos: RecebimentosDto[];
}
