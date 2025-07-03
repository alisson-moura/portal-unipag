import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class EstabelecimentoDto {
  @ApiProperty()
  estabelecimento_id: number;

  @ApiProperty()
  taxa_comissao: number;

  @ApiProperty()
  numero_documento: string;

  @ApiProperty()
  razao_social: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  vendedor_id: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  atribuido_em: Date;
}

export class AtribuirEstabelecimentoDto extends OmitType(EstabelecimentoDto, [
  'atribuido_em',
  'status',
  'vendedor_id',
] as const) {}

export class AlterarTaxaComissaoDto extends PickType(EstabelecimentoDto, [
  'taxa_comissao',
] as const) {}
