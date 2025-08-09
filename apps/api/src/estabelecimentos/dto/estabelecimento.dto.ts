import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/dto/usuario.dto';

export class EstabelecimentoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ceo_pag_id: number;

  @ApiProperty({
    description: 'Número do documento (CNPJ ou CPF) do estabelecimento.',
    example: '12345678000195',
  })
  document_number: string;

  @ApiProperty({
    description: 'Razão social do estabelecimento.',
    example: 'Empresa Exemplo LTDA',
  })
  social_reason: string;

  @ApiProperty({
    description: 'Nome fantasia ou nome comercial do estabelecimento.',
    example: 'Nome Fantasia Exemplo',
  })
  name: string;

  @ApiProperty({
    description:
      'Status do estabelecimento (ex: 1 para Ativo, 0 para Inativo).',
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: 'Origem da conta ou sistema de onde o registro foi importado.',
    example: 'sistema_legado',
  })
  account_source: string;

  @ApiProperty({
    required: false,
  })
  indicacao?: string;

  @ApiProperty({
    required: false,
    type: Usuario,
  })
  gestor?: Usuario;
}
