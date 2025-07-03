import { Controller, Get, Query } from '@nestjs/common';
import { ApiCeoPagService } from './api.service';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaginatedEstabelecimentoDto } from './dto/estabelecimento.dto';

@Controller('ceopag')
export class CeoPagController {
  constructor(private readonly apiService: ApiCeoPagService) {}

  @ApiQuery({
    name: 'busca',
    description: 'Filtro para nome ou razão social',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    default: 1,
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PaginatedEstabelecimentoDto,
  })
  @ApiOperation({
    summary: 'Lista de estabelecimentos cadastrados na CeoPag',
  })
  @Get('estabelecimentos')
  estabelecimentos(@Query() query: { busca: string; page: number }) {
    return this.apiService.listarEstabelecimentos(query);
  }
}
