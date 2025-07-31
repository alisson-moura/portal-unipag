import { ApiProperty } from '@nestjs/swagger';

export class BandeiraItemDto {
  @ApiProperty({
    description: 'O nome da bandeira do cartão ou método de pagamento.',
    example: 'MASTERCARD',
  })
  Bandeira: string;

  @ApiProperty({
    description: 'A quantidade total de vendas para essa bandeira.',
    example: 2147,
  })
  QtdeVendas: number;
}

export class ResumoBandeirasDto {
  @ApiProperty({
    description: 'Identificador do tipo de objeto retornado.',
    example: 'Bandeiras',
  })
  object: string;

  @ApiProperty({
    description: 'Uma lista contendo o resumo de vendas por bandeira.',
    type: [BandeiraItemDto],
  })
  items: BandeiraItemDto[];
}
