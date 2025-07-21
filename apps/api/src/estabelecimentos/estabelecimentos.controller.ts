import { Controller, Get } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstabelecimentoDto } from './dto/estabelecimento.dto';

@ApiTags('Estabelecimentos')
@ApiBearerAuth()
@Controller('estabelecimentos')
export class EstabelecimentosController {
  constructor(
    private readonly estabelecimentosService: EstabelecimentosService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os estabelecimentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estabelecimentos retornada com sucesso.',
    type: EstabelecimentoDto,
    isArray: true,
  })
  findAll() {
    return this.estabelecimentosService.findAll();
  }
}
