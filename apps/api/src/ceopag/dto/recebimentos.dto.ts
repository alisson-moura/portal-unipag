export class GetRecebimentosCeoPagParamsDto {
  mid: number;
  start_date: string;
  finish_date: string;
  page?: number;
}

export class RecebimentosCeoPagDto {
  mensagem: string;
  report_type: string;
  totais: Totais;
  paids: Paids;
}

export interface Totais {
  gross_amount: number;
  mdr: number;
  rav: number;
  net_amount: number;
}

export interface Paids {
  page: string;
  per_page: number;
  pre_page: number;
  next_page: number;
  total: number;
  total_pages: number;
  data: DailyTotais[];
}

export interface DailyTotais {
  payment_date: string;
  gross_amount: number;
  mdr: number;
  rav: number;
  net_amount: number;
  payables: Payable[];
}

export interface Payable {
  merchants_id: number;
  merchants_document_number: string;
  merchants_name: string;
  original_merchants_id: number;
  original_document_number: string;
  original_merchants_name: string;
  payables_id: number;
  transaction_id: number;
  authorization_code: string;
  authorization_currency_code: string;
  card_brand: string;
  payment_method: string;
  installments: number;
  transaction_nsu: string;
  transaction_tef_nsu: string;
  transaction_amount: string;
  original_transaction_amount: string;
  split_rules: any;
  transaction_splited: string;
  transaction_date: string;
  payables_installment: number;
  payables_mdr: number;
  payables_rav: number;
  payables_gross_amount: number;
  payables_net_amount: number;
  payables_split_rule_id: any;
  anticipated: string;
  payables_status: string;
  payment_date: string;
  original_payment_date: string;
  payables_type: string;
  created_at: string;
  updated_at: string;
}
