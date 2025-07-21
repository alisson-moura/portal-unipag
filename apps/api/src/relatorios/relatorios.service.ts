import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeriodQueryDto } from './dto/period-query';
import { ApiCeoPagService } from 'src/ceopag/api.service';
import { VendedorRecebimentosDto } from './dto/vendedor-recebimentos.dto';
import { EstabelecimentoRecebimentosDto } from './dto/estabelecimento-recebimentos.dto';

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

    console.log(query);

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

      const taxa_comissao = Number(indicacao.taxa_comissao) / 100;
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
}
