import { ApiProperty } from '@nestjs/swagger';
import { Contador, Transaction } from '../../ceopag/dto/transacoes.dto';

export class RelatoriosTransacoesGestorDto {
  @ApiProperty({
    type: Transaction,
    isArray: true,
  })
  data: Transaction[];

  @ApiProperty({
    type: Contador,
  })
  contador: Contador;
}
