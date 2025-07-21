import { ApiProperty } from '@nestjs/swagger';
import { EstabelecimentoResponseDto } from './estabelecimento-response.dto';

export class IndicacaoResponseDto {
  @ApiProperty({ example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210' })
  id: string;

  @ApiProperty({ description: 'Taxa de comissão percentual', example: 5.5 })
  taxa_comissao: number;

  @ApiProperty()
  atribuido_em: Date;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  usuario_id: string;

  @ApiProperty({ example: 'b1c2d3e4-f5g6-7890-1234-567890abcdef' })
  estabelecimento_id: string;

  @ApiProperty({ type: () => EstabelecimentoResponseDto })
  estabelecimento: EstabelecimentoResponseDto;
}
