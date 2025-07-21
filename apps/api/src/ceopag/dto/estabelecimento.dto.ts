import { ApiProperty } from '@nestjs/swagger';

export class EstabelecimentoCeoPagDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  document_number: string;
  @ApiProperty()
  social_reason: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  created_at: string;
  @ApiProperty({
    description: 'informa em qual base o estabelecimento está cadastrado',
  })
  account_source: 'ONE' | 'TWO';
}

export class PaginatedEstabelecimentoDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  perPage: string;

  @ApiProperty()
  page: string;

  @ApiProperty()
  lastPage: number;

  @ApiProperty({ type: EstabelecimentoCeoPagDto, isArray: true })
  data: EstabelecimentoCeoPagDto[];
}
