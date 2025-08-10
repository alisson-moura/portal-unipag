import { ApiProperty } from '@nestjs/swagger';

export class TransacaoCsvDto {
  @ApiProperty()
  codigo_ec: string;

  @ApiProperty()
  ec: string;

  @ApiProperty()
  origem: string;

  @ApiProperty()
  id_venda: string;

  @ApiProperty()
  data_venda: string;

  @ApiProperty()
  bandeira: string;

  @ApiProperty()
  nsu_doc_cv: string;

  @ApiProperty()
  codigo_autorizacao: string;

  @ApiProperty()
  parcelas: string;

  @ApiProperty()
  modalidade: string;

  @ApiProperty()
  valor_venda: string;

  @ApiProperty()
  mdr: string;

  @ApiProperty()
  antecipacao: string;

  @ApiProperty()
  valor_liquido: string;

  @ApiProperty()
  tipo_terminal: string;

  @ApiProperty()
  terminal: string;

  @ApiProperty()
  data_confirmacao_venda: string;

  @ApiProperty()
  situacao: string;
}
