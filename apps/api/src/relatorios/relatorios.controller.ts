import { Controller, Get, Param, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { TotalDto } from './dto/total.dto';
import { PeriodQueryDto } from './dto/period-query';
import { VendedorRecebimentosDto } from './dto/vendedor-recebimentos.dto';
import { EstabelecimentoRecebimentosDto } from './dto/estabelecimento-recebimentos.dto';
import { RankingVendedoresDto } from './dto/ranking-vendedores.dto';

@ApiBearerAuth()
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @ApiOkResponse({ type: TotalDto })
  @ApiOperation({
    summary: 'Total de comissão no período informado',
  })
  @Get('comissao')
  comissao(@Query() query: PeriodQueryDto) {
    return this.relatoriosService.totalComissao(query);
  }

  @ApiOkResponse({ type: RankingVendedoresDto, isArray: true })
  @ApiOperation({
    summary: 'Comissão por vendedor no perido informado',
  })
  @Get('vendedores/ranking')
  rankingMdrVendedores(@Query() query: PeriodQueryDto) {
    return this.relatoriosService.comissaoVendedores(query);
  }

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

  @ApiParam({
    name: 'id',
    description: 'ID do vendedor',
  })
  @ApiOperation({
    summary: 'Recebimentos do vendedor no período informado',
  })
  @ApiOkResponse({ type: VendedorRecebimentosDto })
  @Get('vendedores/:id')
  recebimentosVendedor(
    @Param('id') id: string,
    @Query() query: PeriodQueryDto,
  ) {
    return this.relatoriosService.recebimentosVendedor(id, query);
  }

  @ApiParam({
    name: 'id',
    description: 'ID do estabelecimento',
  })
  @ApiOperation({
    summary: 'Recebimentos do vendedor no estabelecimento e periodo informados',
  })
  @ApiOkResponse({ type: EstabelecimentoRecebimentosDto })
  @Get('estabelecimentos/:id')
  recebimentosEstabelecimento(
    @Param('id') id: string,
    @Query() query: PeriodQueryDto,
  ) {
    return this.relatoriosService.recebimentosEstabelecimento(id, query);
  }
}
