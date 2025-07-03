import { ApiProperty } from '@nestjs/swagger';

export class TotalDto {
  @ApiProperty()
  total: number;
}
