import { Controller, Get, Param, Query, Req } from '@nestjs/common';
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
import {
  TransactionQueryDto,
  TransactionResponseDto,
} from 'src/ceopag/dto/transacoes.dto';
import { ResumoTransacoesDto } from 'src/ceopag/dto/resumo-transacoes.dto';
import { ResumoBandeirasDto } from 'src/ceopag/dto/resumo-bandeiras';
import { ResumoTransacoesPeriodoDto } from 'src/ceopag/dto/resumo-transacoes-periodo';
import { UserPayloadDto } from '../auth/auth.dto';
import { RelatoriosTransacoesGestorDto } from './dto/relatorio-transacoes-gestor';

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

  @ApiOperation({
    summary: 'Relatório de vendas e transações',
  })
  @ApiOkResponse({ type: TransactionResponseDto })
  @Get('/transacoes')
  transacoes(
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionResponseDto> {
    return this.relatoriosService.getConsolidatedTransactions(query);
  }

  @ApiOperation({
    summary: 'Resumo das transações no periodo informado',
  })
  @ApiOkResponse({ type: ResumoTransacoesDto })
  @Get('/transacoes/resumo')
  resumoTransacoes(
    @Query() query: PeriodQueryDto,
  ): Promise<ResumoTransacoesDto> {
    return this.relatoriosService.resumoTransacoesConsolidado(query);
  }

  @ApiOperation({
    summary: 'Resumo das transações por bandeira no periodo informado',
  })
  @ApiOkResponse({ type: ResumoBandeirasDto })
  @Get('/transacoes/resumo/bandeiras')
  resumoBandeiras(@Query() query: PeriodQueryDto): Promise<ResumoBandeirasDto> {
    return this.relatoriosService.resumoTransacoesPorBandeiraConsolidado(query);
  }

  @ApiOperation({
    summary: 'Resumo das transações por status no periodo informado',
  })
  @ApiOkResponse({ type: ResumoTransacoesPeriodoDto })
  @Get('/transacoes/resumo/periodo')
  resumoPeriodo(
    @Query() query: PeriodQueryDto,
  ): Promise<ResumoTransacoesPeriodoDto> {
    return this.relatoriosService.resumoTransacoesDiariasConsolidado(query);
  }

  @ApiOperation({
    summary:
      'Relatório de vendas e transações para o gestor de estabelecimentos',
  })
  @ApiOkResponse({ type: RelatoriosTransacoesGestorDto })
  @Get('/transacoes/gestor')
  transacoesPorGestor(
    @Req() req: { user: UserPayloadDto },
    @Query() query: TransactionQueryDto,
  ) {
    return this.relatoriosService.transacoesConsolidadasPorGestor({
      query,
      gestor_id: req.user.id,
    });
  }
}
