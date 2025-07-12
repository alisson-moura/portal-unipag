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

export class PayableDto {
  @ApiProperty({
    description: 'ID do estabelecimento.',
    example: 123,
  })
  merchants_id: number;

  @ApiProperty({
    description: 'Número do documento do estabelecimento.',
    example: '12345678000195',
  })
  merchants_document_number: string;

  @ApiProperty({
    description: 'Nome do estabelecimento.',
    example: 'Nome do Estabelecimento',
  })
  merchants_name: string;

  @ApiProperty({
    description: 'ID original do estabelecimento.',
    example: 123,
  })
  original_merchants_id: number;

  @ApiProperty({
    description: 'Número do documento original do estabelecimento.',
    example: '12345678000195',
  })
  original_document_number: string;

  @ApiProperty({
    description: 'Nome original do estabelecimento.',
    example: 'Nome Original do Estabelecimento',
  })
  original_merchants_name: string;

  @ApiProperty({
    description: 'ID do recebível.',
    example: 456,
  })
  payables_id: number;

  @ApiProperty({
    description: 'ID da transação.',
    example: 789,
  })
  transaction_id: number;

  @ApiProperty({
    description: 'Código de autorização da transação.',
    example: 'A1B2C3D4',
  })
  authorization_code: string;

  @ApiProperty({
    description: 'Código da moeda de autorização.',
    example: 'BRL',
  })
  authorization_currency_code: string;

  @ApiProperty({
    description: 'Bandeira do cartão.',
    example: 'Visa',
  })
  card_brand: string;

  @ApiProperty({
    description: 'Método de pagamento.',
    example: 'credit_card',
  })
  payment_method: string;

  @ApiProperty({
    description: 'Número de parcelas da transação.',
    example: 1,
  })
  installments: number;

  @ApiProperty({
    description: 'NSU da transação.',
    example: '123456789',
  })
  transaction_nsu: string;

  @ApiProperty({
    description: 'NSU do TEF da transação.',
    example: '987654321',
  })
  transaction_tef_nsu: string;

  @ApiProperty({
    description: 'Valor da transação.',
    example: '100.00',
  })
  transaction_amount: string;

  @ApiProperty({
    description: 'Valor original da transação.',
    example: '100.00',
  })
  original_transaction_amount: string;

  @ApiProperty({
    description: 'Regras de divisão da transação.',
    example: null,
    nullable: true,
  })
  split_rules: any;

  @ApiProperty({
    description: 'Indica se a transação foi dividida.',
    example: 'false',
  })
  transaction_splited: string;

  @ApiProperty({
    description: 'Data da transação.',
    example: '2025-07-21T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  transaction_date: string;

  @ApiProperty({
    description: 'Número da parcela do recebível.',
    example: 1,
  })
  payables_installment: number;

  @ApiProperty({
    description: 'Taxa de MDR do recebível.',
    example: 2.5,
  })
  payables_mdr: number;

  @ApiProperty({
    description: 'Taxa de RAV do recebível.',
    example: 0.5,
  })
  payables_rav: number;

  @ApiProperty({
    description: 'Valor bruto do recebível.',
    example: 100.0,
  })
  payables_gross_amount: number;

  @ApiProperty({
    description: 'Valor líquido do recebível.',
    example: 97.0,
  })
  payables_net_amount: number;

  @ApiProperty({
    description: 'ID da regra de divisão do recebível.',
    example: null,
    nullable: true,
  })
  payables_split_rule_id: any;

  @ApiProperty({
    description: 'Indica se o recebível foi antecipado.',
    example: 'false',
  })
  anticipated: string;

  @ApiProperty({
    description: 'Status do recebível.',
    example: 'paid',
  })
  payables_status: string;

  @ApiProperty({
    description: 'Data de pagamento.',
    example: '2025-08-20T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  payment_date: string;

  @ApiProperty({
    description: 'Data de pagamento original.',
    example: '2025-08-20T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  original_payment_date: string;

  @ApiProperty({
    description: 'Tipo do recebível.',
    example: 'credit',
  })
  payables_type: string;

  @ApiProperty({
    description: 'Data de criação.',
    example: '2025-07-21T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  created_at: string;

  @ApiProperty({
    description: 'Data da última atualização.',
    example: '2025-07-21T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  updated_at: string;
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

  @ApiProperty({ type: PayableDto, isArray: true })
  pagamentos: PayableDto[];
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
