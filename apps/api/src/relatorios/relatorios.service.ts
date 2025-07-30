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

  async recebimentosVendedor(
    id: string,
    query: PeriodQueryDto,
  ): Promise<VendedorRecebimentosDto> {
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

      const taxa_comissao = indicacao.taxa_comissao / 100;
      const mdr = recebimentoCeoPag.totais.mdr * taxa_comissao;

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

    const taxa_comissao = Number(estabelecimento.indicacao.taxa_comissao) / 100;
    const recebimentos = recebimentoCeoPag.paids.data.map((paid) => ({
      data_recebimento: paid.payment_date,
      tpv: paid.gross_amount,
      mdr: paid.mdr * taxa_comissao,
      rav: paid.rav,
      liquido: paid.net_amount,
      pagamentos: paid.payables.map((paid) => ({
        ...paid,
        payables_mdr: paid.payables_mdr * taxa_comissao,
      })),
    }));
    return {
      totais: {
        tpv: recebimentoCeoPag.totais.gross_amount,
        mdr: recebimentoCeoPag.totais.mdr * taxa_comissao,
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
}
