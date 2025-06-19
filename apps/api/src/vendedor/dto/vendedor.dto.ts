import { ApiProperty } from '@nestjs/swagger';

export class CreateVendedorDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;
}

export class EstabelecimentoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vendedor_id: string;
}

export class VendedorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  data_contratacao: Date;

  @ApiProperty({ type: EstabelecimentoDto, isArray: true })
  estabelecimentos: EstabelecimentoDto[];
}
