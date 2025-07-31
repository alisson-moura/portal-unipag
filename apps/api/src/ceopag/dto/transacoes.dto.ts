import { ApiProperty } from '@nestjs/swagger';
import { PeriodQueryDto } from 'src/relatorios/dto/period-query';

export class StatusCounter {
  @ApiProperty({
    description: 'Valor monetário total para este status.',
    example: 1500,
    type: Number,
  })
  valor: number | null;

  @ApiProperty({
    description: 'Quantidade total de transações para este status.',
    example: 10,
    type: Number,
  })
  quantidade: number | null;
}

export class Contador {
  @ApiProperty({
    type: StatusCounter,
    description: 'Contador de transações aprovadas.',
  })
  aprovadas: StatusCounter;

  @ApiProperty({
    type: StatusCounter,
    description: 'Contador de transações pendentes.',
  })
  pendentes: StatusCounter;

  @ApiProperty({
    type: StatusCounter,
    description: 'Contador de transações negadas.',
  })
  negadas: StatusCounter;

  @ApiProperty({
    type: StatusCounter,
    description: 'Contador de transações desfeitas.',
  })
  desfeitas: StatusCounter;

  @ApiProperty({
    type: StatusCounter,
    description: 'Contador de transações devolvidas.',
  })
  devolvidas: StatusCounter;
}

export class Transaction {
  @ApiProperty({ example: 123456 })
  id: number;

  @ApiProperty({ description: 'Status da transação.', example: 'approved' })
  status: string;

  @ApiProperty({
    description: 'Motivo da recusa, se aplicável.',
    example: 'insufficient_funds',
    required: false,
  })
  refuse_reason?: string;

  @ApiProperty({
    description: 'Código de resposta do adquirente.',
    example: '00',
  })
  acquirer_response_code: string;

  @ApiProperty({ description: 'Nome do adquirente.', example: 'Cielo' })
  acquirer_name: string;

  @ApiProperty({ description: 'ID do adquirente.', example: '100' })
  acquirer_id: string;

  @ApiProperty({
    description: 'Código de autorização da transação.',
    example: '123456',
    required: false,
  })
  authorization_code?: string;

  @ApiProperty({ description: 'NSU da transação TEF.', example: '987654321' })
  tef_nsu: string;

  @ApiProperty({
    description: 'Identificador único universal da transação.',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  uuid: string;

  @ApiProperty({
    description: 'Número Sequencial Único (NSU).',
    example: '123456789',
  })
  nsu: string;

  @ApiProperty({ description: 'Valor da transação.', example: '150.00' })
  amount: string;

  @ApiProperty({
    description: 'Valor da operação (tipo variado).',
    example: null,
  })
  amount_operation: null | string;

  @ApiProperty({
    description: 'Taxa da operação.',
    example: '3.50',
    required: false,
  })
  fee_operation?: string;

  @ApiProperty({ description: 'Custo do adquirente.', example: 1.25 })
  custo_adquirente: number;

  @ApiProperty({
    description: 'Custo MDR (Merchant Discount Rate).',
    example: '4.50',
  })
  custo_mdr: string;

  @ApiProperty({ description: 'Valor da taxa de intercâmbio.', example: 0.75 })
  valor_interchange: number;

  @ApiProperty({ description: 'Valor da taxa de administração.', example: 0.5 })
  valor_taxa_administracao: number;

  @ApiProperty({ description: 'Valor devolvido.', example: '0.00' })
  refunded_amount: string;

  @ApiProperty({ description: 'Número de parcelas.', example: 1 })
  installments: number;

  @ApiProperty({ description: 'ID do estabelecimento.', example: 9876 })
  merchant_id: number;

  @ApiProperty({
    description: 'Nome do estabelecimento.',
    example: 'Minha Loja LTDA',
  })
  merchant_name: string;

  @ApiProperty({
    description: 'CNPJ/CPF do estabelecimento.',
    example: '12.345.678/0001-99',
  })
  merchant_document_number: string;

  @ApiProperty({
    description: 'Nome do portador do cartão.',
    example: 'JOAO DA SILVA',
    required: false,
  })
  card_holder_name?: string;

  @ApiProperty({
    description: 'Primeiros dígitos do cartão.',
    example: '411111',
    required: false,
  })
  card_first_digits?: string;

  @ApiProperty({
    description: 'Últimos dígitos do cartão.',
    example: '1111',
    required: false,
  })
  card_last_digits?: string;

  @ApiProperty({ description: 'Bandeira do cartão.', example: 'Visa' })
  card_brand: string;

  @ApiProperty({ description: 'Modo de inserção do cartão (PIN).', example: 1 })
  card_pin_mode: number;

  @ApiProperty({ description: 'Método de pagamento.', example: 'credit_card' })
  payment_method: string;

  @ApiProperty({ description: 'Método de captura.', example: 'emv' })
  capture_method: string;

  @ApiProperty({ description: 'Parceiro de captura.', example: 'PartnerX' })
  capture_partner: string;

  @ApiProperty({
    description: 'Número de série do dispositivo.',
    example: 'SN123456789',
  })
  device_serial_number: string;

  @ApiProperty({
    description: 'Provedor do SIM card.',
    example: null,
  })
  simcard_provider: null | string;

  @ApiProperty({
    description: 'Número de série do SIM card.',
    example: 'SIM987654321',
    required: false,
  })
  simcard_serial_number?: string;

  @ApiProperty({
    description: 'Valor do boleto.',
    example: null,
  })
  boleto_valor: null | string;

  @ApiProperty({
    description: 'Código de barras do boleto.',
    example: null,
  })
  codigo_barras: null | string;

  @ApiProperty({
    description:
      'Indica se é uma transação de e-commerce (1 para sim, 0 para não).',
    example: 0,
  })
  ecommerce: number;

  @ApiProperty({
    description: 'Conta do adquirente.',
    example: null,
  })
  conta_adquirente: null | string;

  @ApiProperty({
    description: 'Taxa MDR (Merchant Discount Rate) aplicada.',
    example: 2.99,
  })
  mdr: number;

  @ApiProperty({ description: 'Taxa de antecipação.', example: 1.99 })
  anticipation_fee: number;

  @ApiProperty({
    description: 'Valor líquido a ser recebido pelo estabelecimento.',
    example: 145.51,
  })
  valor_liquido: number;

  @ApiProperty({ description: 'Resolução da captura.', example: 0 })
  resolucao_captura: number;

  @ApiProperty({ description: 'Resolução do adquirente.', example: 0 })
  resolucao_adquirente: number;

  @ApiProperty({
    description: 'Data de início da transação.',
    example: '2025-07-29T10:00:00.000Z',
    format: 'date-time',
  })
  start_date: string;

  @ApiProperty({
    description: 'Data de finalização da transação.',
    example: '2025-07-29T10:00:05.000Z',
    format: 'date-time',
  })
  finish_date: string;

  @ApiProperty({
    description: 'Data de pagamento/liquidação.',
    example: '2025-08-28T00:00:00.000Z',
    format: 'date-time',
  })
  payment_date: string;

  @ApiProperty({
    description: 'Data de criação do registro.',
    example: '2025-07-29T10:00:05.000Z',
    format: 'date-time',
  })
  created_at: string;

  @ApiProperty({
    description: 'Data da última atualização do registro.',
    example: '2025-07-29T10:00:05.000Z',
    format: 'date-time',
  })
  updated_at: string;

  @ApiProperty({
    description: 'ID original do estabelecimento.',
    example: 9876,
  })
  original_merchants_id: number;

  @ApiProperty({
    description: 'Documento original do estabelecimento.',
    example: '12.345.678/0001-99',
  })
  original_document_number: string;

  @ApiProperty({
    description: 'Nome original do estabelecimento.',
    example: 'Minha Loja LTDA',
  })
  original_merchants_name: string;
}

export class PaginatedTransactions {
  @ApiProperty({ description: 'Número total de itens.', example: 153 })
  total: number;

  @ApiProperty({ description: 'Número de itens por página.', example: 15 })
  perPage: number;

  @ApiProperty({ description: 'Número da página atual.', example: 1 })
  page: number;

  @ApiProperty({ description: 'Número da última página.', example: 11 })
  lastPage: number;

  @ApiProperty({
    description: 'Lista de transações da página atual.',
    type: [Transaction],
  })
  data: Transaction[];
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Mensagem de status da resposta.',
    example: 'Consulta realizada com sucesso.',
  })
  mensagem: string;

  @ApiProperty({
    description: 'Objeto contendo os contadores de transações por status.',
  })
  contador: Contador;

  @ApiProperty({
    description: 'Objeto com os dados paginados das transações.',
  })
  transacoes: PaginatedTransactions;
}

export class TransactionQueryDto extends PeriodQueryDto {
  @ApiProperty({
    description: 'Pagina do relatório',
    example: 1,
    required: true,
  })
  page: number;

  @ApiProperty({
    description: 'ID do estabelecimento',
    example: 1,
    required: false,
  })
  mid?: number;
}
