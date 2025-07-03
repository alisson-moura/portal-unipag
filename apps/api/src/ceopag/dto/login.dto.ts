export class LoginResponseDto {
  customers_id: number;
  vendor_id: number;
  logo: string;
  user_name: string;
  type: string;
  access_token: string;
  visualizar_menu: string[];
  visualizar_taxas: string;
  permissoes: any[];
  estabelecimentos: Array<{
    mid: number;
    document_number: string;
    name: string;
  }>;
  expires_at: number;
}
