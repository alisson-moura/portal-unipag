import { Controller, Get, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TotalDto } from './dto/total.dto';
import { RankingVendedoresDto } from './dto/ranking-vendedores.dto';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @ApiOkResponse({ type: TotalDto })
  @ApiOperation({ summary: 'Total de vendedores ativos' })
  @Get('vendedores')
  totalVendedores() {
    return this.relatoriosService.countVendedores();
  }

  @ApiOkResponse({ type: TotalDto })
  @ApiOperation({
    summary: 'Total de estabelecimentos atríbuidos a vendedores',
  })
  @Get('estabelecimentos')
  totalEstabelecimentos() {
    return this.relatoriosService.countEstabelecimentos();
  }

  @ApiQuery({
    name: 'start_date',
    type: String,
    example: '2025-05-01',
    required: true,
  })
  @ApiQuery({
    name: 'finish_date',
    type: String,
    example: '2025-05-31',
    required: true,
  })
  @ApiOkResponse({ type: TotalDto })
  @ApiOperation({
    summary: 'Total de comissão no período informado',
  })
  @Get('comissao')
  comissao(@Query() query: { start_date: string; finish_date: string }) {
    return this.relatoriosService.totalComissao(query);
  }

  @ApiQuery({
    name: 'start_date',
    type: String,
    example: '2025-05-01',
    required: true,
  })
  @ApiQuery({
    name: 'finish_date',
    type: String,
    example: '2025-05-31',
    required: true,
  })
  @ApiOkResponse({ type: RankingVendedoresDto, isArray: true })
  @ApiOperation({
    summary: 'Comissão por vendedor no perido informado',
  })
  @Get('vendedores/ranking')
  rankingMdrVendedores(
    @Query() query: { start_date: string; finish_date: string },
  ) {
    return this.relatoriosService.comissaoVendedores(query);
  }
}
