import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeriodQueryDto } from './dto/period-query';
import { AccountIdentifier, ApiCeoPagService } from 'src/ceopag/api.service';
import { VendedorRecebimentosDto } from './dto/vendedor-recebimentos.dto';
import { EstabelecimentoRecebimentosDto } from './dto/estabelecimento-recebimentos.dto';
import {
  Contador,
  PaginatedTransactions,
  TransactionQueryDto,
  TransactionResponseDto,
} from 'src/ceopag/dto/transacoes.dto';
import {
  DadosFaturamentoDto,
  ResumoTransacoesDto,
} from 'src/ceopag/dto/resumo-transacoes.dto';
import {
  BandeiraItemDto,
  ResumoBandeirasDto,
} from 'src/ceopag/dto/resumo-bandeiras';
import {
  ResumoTransacoesPeriodoDto,
  TransacaoDiariaDto,
} from 'src/ceopag/dto/resumo-transacoes-periodo';

import { Prisma } from '@prisma/client';

@Injectable()
export class RelatoriosService {
  constructor(
    private database: PrismaService,
    private ceopagService: ApiCeoPagService,
  ) {}

  async countVendedores() {
    const total = await this.database.usuario.count({
      where: {
        ativo: true,
        role: 'VENDEDOR',
      },
    });
    return {
      total,
    };
  }

  async countEstabelecimentos() {
    const total = await this.database.estabelecimentoCeoPag.count();
    return {
      total,
    };
  }

  private calcularMdrVendedor(
    grossAmount: number,
    taxaAdministrativa: Prisma.Decimal,
    taxaComissaoVendedor: number,
  ): number {
    const grossAmountDecimal = new Prisma.Decimal(grossAmount);
    const taxaVendedorDecimal = new Prisma.Decimal(taxaComissaoVendedor).div(
      100,
    );

    const mdrUnipag = taxaAdministrativa.mul(grossAmountDecimal);
    const mdrVendedor = mdrUnipag.mul(taxaVendedorDecimal);

    return mdrVendedor.round().toNumber();
  }

  async recebimentosVendedor(
    id: string,
    query: PeriodQueryDto,
  ): Promise<VendedorRecebimentosDto> {
    const taxaAdministrativa =
      await this.database.taxaAdministrativa.findFirstOrThrow();

    const indicacoes = await this.database.indicacao.findMany({
      where: {
        usuario_id: id,
      },
      include: {
        estabelecimento: true,
      },
    });

    const promiseRecebimentos = indicacoes.map(async (indicacao) => {
      const recebimentoCeoPag = await this.ceopagService.recebimentosLiquidados(
        {
          id: indicacao.estabelecimento.id,
          ...query,
        },
      );

      if (recebimentoCeoPag == null)
        return {
          estabelecimento: indicacao.estabelecimento,
          mdr: 0,
          tpv: 0,
          rav: 0,
          liquido: 0,
        };

      const mdr = this.calcularMdrVendedor(
        recebimentoCeoPag.totais.gross_amount,
        taxaAdministrativa.taxa,
        indicacao.taxa_comissao,
      );

      return {
        estabelecimento: indicacao.estabelecimento,
        mdr,
        tpv: recebimentoCeoPag.totais.gross_amount,
        rav: recebimentoCeoPag.totais.rav,
        liquido: recebimentoCeoPag.totais.net_amount,
      };
    });

    const recebimentos = await Promise.all(promiseRecebimentos);

    return {
      recebimentos,
      totais: recebimentos.reduce(
        (acc, current) => ({
          mdr: current.mdr + acc.mdr,
          tpv: current.tpv + acc.tpv,
          rav: current.rav + acc.rav,
          liquido: current.liquido + acc.liquido,
        }),
        {
          mdr: 0,
          tpv: 0,
          rav: 0,
          liquido: 0,
        },
      ),
    };
  }

  async recebimentosEstabelecimento(
    id: string,
    query: PeriodQueryDto,
  ): Promise<EstabelecimentoRecebimentosDto> {
    const taxaAdministrativa =
      await this.database.taxaAdministrativa.findFirstOrThrow();

    const estabelecimento =
      await this.database.estabelecimentoCeoPag.findUnique({
        where: { id },
        include: { indicacao: true },
      });

    if (!estabelecimento || !estabelecimento.indicacao)
      throw new BadRequestException('Atribua o estabelecimento a um vendedor');

    const recebimentoCeoPag = await this.ceopagService.recebimentosLiquidados({
      id: estabelecimento.id,
      ...query,
    });

    if (recebimentoCeoPag == null) {
      return {
        totais: {
          tpv: 0,
          mdr: 0,
          rav: 0,
          liquido: 0,
        },
        recebimentos: [],
      };
    }

    const recebimentos = recebimentoCeoPag.paids.data.map((paid) => ({
      data_recebimento: paid.payment_date,
      tpv: paid.gross_amount,
      mdr: this.calcularMdrVendedor(
        paid.gross_amount,
        taxaAdministrativa.taxa,
        estabelecimento.indicacao!.taxa_comissao,
      ),
      rav: paid.rav,
      liquido: paid.net_amount,
      pagamentos: paid.payables.map((paid) => ({
        ...paid,
        payables_mdr: this.calcularMdrVendedor(
          paid.payables_gross_amount,
          taxaAdministrativa.taxa,
          estabelecimento.indicacao!.taxa_comissao,
        ),
      })),
    }));
    return {
      totais: {
        tpv: recebimentoCeoPag.totais.gross_amount,
        mdr: this.calcularMdrVendedor(
          recebimentoCeoPag.totais.gross_amount,
          taxaAdministrativa.taxa,
          estabelecimento.indicacao.taxa_comissao,
        ),
        rav: recebimentoCeoPag.totais.rav,
        liquido: recebimentoCeoPag.totais.net_amount,
      },
      recebimentos,
    };
  }

  async totalComissao(query: PeriodQueryDto) {
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
        ativo: true,
      },
    });

    const recebimentosPorVendedor = await Promise.all(
      vendedores.map((vendedor) =>
        this.recebimentosVendedor(vendedor.id, query),
      ),
    );

    return {
      total: recebimentosPorVendedor.reduce(
        (acc, current) => current.totais.mdr + acc,
        0,
      ),
    };
  }

  async comissaoVendedores(query: PeriodQueryDto) {
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
        ativo: true,
      },
    });

    const recebimentosPorVendedor = await Promise.all(
      vendedores.map(async (vendedor) => {
        const recebimentos = await this.recebimentosVendedor(
          vendedor.id,
          query,
        );

        return {
          id: vendedor.id,
          nome: vendedor.nome,
          mdr: recebimentos.totais.mdr,
        };
      }),
    );

    return recebimentosPorVendedor;
  }

  /**
   * Gera um relatório de transações consolidado de múltiplas contas independentes.
   */
  async getConsolidatedTransactions(
    query: TransactionQueryDto,
  ): Promise<TransactionResponseDto> {
    const accountIdentifiers = ['ONE', 'TWO'];
    const maxPerPagePerSource = 10;

    try {
      // 1. Pede a MESMA PÁGINA para todas as fontes, em paralelo.
      const responses = await Promise.all(
        accountIdentifiers.map((account: AccountIdentifier) =>
          this.ceopagService.transacoes(account, query),
        ),
      );

      const [firstBase, secondBase] = responses;

      // 2. Mescla contadores e dados totais globais.
      const mergedCounters = this.mergeCounters(
        firstBase.contador,
        secondBase.contador,
      );
      const totalItems =
        firstBase.transacoes.total + secondBase.transacoes.total;

      // 3. Concatena e ordena os dados recebidos APENAS para a página atual.
      const combinedDataForThisPage = [
        ...firstBase.transacoes.data,
        ...secondBase.transacoes.data,
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      // 4. A `lastPage` da nossa API é determinada pela fonte que tem mais páginas.
      const lastPage = Math.max(
        firstBase.transacoes.lastPage,
        secondBase.transacoes.lastPage,
      );

      // 5. O `perPage` representa o NÚMERO MÁXIMO de itens que uma página pode ter.
      const maxPerPage = maxPerPagePerSource * accountIdentifiers.length; // 10 * 2 = 20

      const mergedPaginatedTransactions: PaginatedTransactions = {
        total: totalItems,
        perPage: maxPerPage, // Informa o MÁXIMO possível por página (100)
        page: query.page,
        lastPage: lastPage, // Usa a maior lastPage das fontes
        data: combinedDataForThisPage,
      };

      const finalResponse = new TransactionResponseDto();
      finalResponse.mensagem = 'Consulta realizada com sucesso.';
      finalResponse.contador = mergedCounters;
      finalResponse.transacoes = mergedPaginatedTransactions;

      return finalResponse;
    } catch (error) {
      console.error('Falha ao gerar relatório consolidado:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ocorreu um erro ao consolidar os relatórios das contas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Mescla dois objetos Contador, somando seus valores.
   * @private
   */
  private mergeCounters(c1: Contador, c2: Contador): Contador {
    const merged = new Contador();
    // Itera sobre as chaves do objeto Contador para evitar repetição
    (Object.keys(c1) as Array<keyof Contador>).forEach((key) => {
      merged[key] = {
        quantidade: (c1[key]?.quantidade ?? 0) + (c2[key]?.quantidade ?? 0),
        valor: (c1[key]?.valor ?? 0) + (c2[key]?.valor ?? 0),
      };
    });
    return merged;
  }

  async resumoTransacoesConsolidado(
    query: PeriodQueryDto,
  ): Promise<ResumoTransacoesDto> {
    const accountIdentifiers: AccountIdentifier[] = ['ONE', 'TWO'];

    try {
      // 1. Manter os resultados em um array para facilitar a iteração.
      const allResults = await Promise.all(
        accountIdentifiers.map((account: AccountIdentifier) =>
          this.ceopagService.resumoTransacoes(account, query),
        ),
      );

      // 2. Definir o estado inicial para o acumulador. Isso resolve o problema de inicialização.
      const initialFaturamento: DadosFaturamentoDto = {
        total: { qtde: 0, valor: 0 },
        debito: { qtde: 0, valor: 0 },
        credito: { qtde: 0, valor: 0 },
        parcelado: { qtde: 0, valor: 0 },
      };

      // 3. Usar reduce para somar os faturamentos de todos os resultados de forma limpa.
      const faturamentoConsolidado = allResults.reduce(
        (acumulador, resultadoAtual) => {
          // Itera sobre as chaves do faturamento ('total', 'debito', etc.)
          (Object.keys(acumulador) as Array<keyof DadosFaturamentoDto>).forEach(
            (key) => {
              // Soma os valores do resultado atual no acumulador
              acumulador[key].qtde += resultadoAtual.Faturamento[key].qtde;
              acumulador[key].valor += resultadoAtual.Faturamento[key].valor;
            },
          );
          return acumulador;
        },
        initialFaturamento, // Começa a soma a partir do objeto com valores zerados
      );

      // 4. Construir o objeto de resposta final.
      const resumoFinal = new ResumoTransacoesDto();
      resumoFinal.Faturamento = faturamentoConsolidado;

      return resumoFinal;
    } catch (error) {
      console.error('Falha ao gerar relatório consolidado:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ocorreu um erro ao consolidar os relatórios das contas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resumoTransacoesPorBandeiraConsolidado(
    query: PeriodQueryDto,
  ): Promise<ResumoBandeirasDto> {
    const accountIdentifiers = ['ONE', 'TWO'];
    try {
      const [firstAccount, secondAccount] = await Promise.all(
        accountIdentifiers.map((account: AccountIdentifier) =>
          this.ceopagService.resumoBandeiras(account, query),
        ),
      );

      const consolidadoMap = new Map<string, number>();
      const todosOsItens = [
        ...(firstAccount.items || []),
        ...(secondAccount.items || []),
      ];

      for (const item of todosOsItens) {
        const { Bandeira, QtdeVendas } = item;
        const vendasAtuais = consolidadoMap.get(Bandeira) || 0;
        consolidadoMap.set(Bandeira, vendasAtuais + QtdeVendas);
      }

      const itensConsolidados: BandeiraItemDto[] = [];
      for (const [bandeira, qtdeVendas] of consolidadoMap.entries()) {
        const newItem = new BandeiraItemDto(); // Usando a classe para garantir a tipagem
        newItem.Bandeira = bandeira;
        newItem.QtdeVendas = qtdeVendas;
        itensConsolidados.push(newItem);
      }

      const resumoFinal = new ResumoBandeirasDto();
      resumoFinal.object = 'Bandeiras';
      resumoFinal.items = itensConsolidados.sort(
        (a, b) => b.QtdeVendas - a.QtdeVendas,
      );

      return resumoFinal;
    } catch (error) {
      console.error('Falha ao gerar relatório consolidado:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ocorreu um erro ao consolidar os relatórios das contas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resumoTransacoesDiariasConsolidado(
    query: PeriodQueryDto,
  ): Promise<ResumoTransacoesPeriodoDto> {
    const accountIdentifiers: AccountIdentifier[] = ['ONE', 'TWO'];
    try {
      const [firstAccountResult, secondAccountResult] = await Promise.all(
        accountIdentifiers.map((account: AccountIdentifier) =>
          this.ceopagService.resumoStatusTransacoes(account, query),
        ),
      );

      const consolidadoMap = new Map<
        string,
        { Aprovadas: number; Negadas: number; Pendentes: number }
      >();

      const todosOsItens = [
        ...(firstAccountResult.items || []),
        ...(secondAccountResult.items || []),
      ];

      // 3. Itera sobre todos os itens para somar os valores por data
      for (const item of todosOsItens) {
        const { Data, Aprovadas, Negadas, Pendentes } = item;
        const diaAtual = consolidadoMap.get(Data);

        if (diaAtual) {
          diaAtual.Aprovadas += Aprovadas;
          diaAtual.Negadas += Negadas;
          diaAtual.Pendentes += Pendentes;
        } else {
          consolidadoMap.set(Data, { Aprovadas, Negadas, Pendentes });
        }
      }

      // Converte o Map de volta para um array de TransacaoDiariaDto
      const itensConsolidados: TransacaoDiariaDto[] = [];
      for (const [data, valores] of consolidadoMap.entries()) {
        const newItem = new TransacaoDiariaDto();
        newItem.Data = data;
        newItem.Aprovadas = valores.Aprovadas;
        newItem.Negadas = valores.Negadas;
        newItem.Pendentes = valores.Pendentes;
        itensConsolidados.push(newItem);
      }
      // Ordena o resultado final por data
      itensConsolidados.sort(
        (a, b) => new Date(a.Data).getTime() - new Date(b.Data).getTime(),
      );

      //  Recalcula os totais e percentuais
      let totalAprovadas = 0;
      let totalNegadas = 0;
      for (const item of itensConsolidados) {
        totalAprovadas += item.Aprovadas;
        totalNegadas += item.Negadas;
      }

      const totalTransacoes = totalAprovadas + totalNegadas;
      let percentualAprovadasFinal = '0.00';
      let percentualNegadasFinal = '0.00';

      if (totalTransacoes > 0) {
        percentualAprovadasFinal = (
          (totalAprovadas / totalTransacoes) *
          100
        ).toFixed(2);
        percentualNegadasFinal = (
          (totalNegadas / totalTransacoes) *
          100
        ).toFixed(2);
      }

      // Monta o objeto final de retorno
      const resumoFinal = new ResumoTransacoesPeriodoDto();
      resumoFinal.object = 'Bandeiras';
      resumoFinal.percentualAprovadas = percentualAprovadasFinal;
      resumoFinal.percentualNegadas = percentualNegadasFinal;
      resumoFinal.items = itensConsolidados;

      return resumoFinal;
    } catch (error) {
      console.error(
        'Falha ao gerar relatório de transações consolidado:',
        error,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ocorreu um erro ao consolidar os relatórios de transações das contas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
