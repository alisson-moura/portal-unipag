export class LoginResponseDto {
    customers_id: number
    vendor_id: number
    logo: string
    user_name: string
    type: string
    access_token: string
    visualizar_menu: string[]
    visualizar_taxas: string
    permissoes: any[]
    estabelecimentos: Array<{
        mid: number
        document_number: string
        name: string
    }>
    expires_at: number
}

export class ListarEstabelecimentoResponseDto {
    message: string
    total: number
    perPage: number
    page: number
    lastPage: number
    data: Estabelecimento[]
}

export interface Estabelecimento {
    id: number
    document_number: string
    social_reason: string
    name: string
    status: number
    created_at: string
}
