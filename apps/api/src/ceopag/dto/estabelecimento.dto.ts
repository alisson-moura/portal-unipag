import { ApiProperty } from '@nestjs/swagger';

export class EstabelecimentoCeoPagDto {
  @ApiProperty()
  id: number;
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
