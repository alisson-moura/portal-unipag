import { ApiProperty } from '@nestjs/swagger';

export class HttpError {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ required: false })
  error?: string;
}
