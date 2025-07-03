import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AlterarTaxaComissaoDto,
  AtribuirEstabelecimentoDto,
  EstabelecimentoDto,
} from './dto/estabelecimento.dto';
import { Usuario } from '@prisma/client';
import { PaginatedDto } from 'src/config/paginated.dto';
import {
  EstabelecimentoRecebimentosDto,
  RecebimentosQueryDto,
  VendedorRecebimentosDto,
} from './dto/recebimentos.dto';
import { ApiCeoPagService } from 'src/ceopag/api.service';

@Injectable()
export class VendedorService {
  constructor(
    private database: PrismaService,
    private apiCeoPag: ApiCeoPagService,
  ) {}

  private async findOrThrow(id: string): Promise<Usuario> {
    const vendedor = await this.database.usuario.findUnique({
      where: { id, role: 'VENDEDOR', ativo: true },
    });
    if (!vendedor) {
      throw new NotFoundException(`Vendedor com ID "${id}" não encontrado.`);
    }
    return vendedor;
  }

  async findAll(params: { page: number }) {
    const page = params.page ?? 1;
    const size = 100;

    const total = await this.database.usuario.count({
      where: { role: 'VENDEDOR' },
    });
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
      },
      orderBy: {
        criado_em: 'asc',
      },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      total,
      page,
      size,
      results: vendedores,
    };
  }

  async atribuirEstabelecimento(
    vendedor_id: string,
    data: AtribuirEstabelecimentoDto,
  ): Promise<void> {
    await this.findOrThrow(vendedor_id);

    const estabelecimento = await this.database.estabelecimento.findUnique({
      where: { estabelecimento_id: data.estabelecimento_id },
    });
    if (estabelecimento)
      throw new BadRequestException(
        'Estabelecimento já está atribuido a um vendedor. Desatribua antes de tentar novamente.',
      );

    await this.database.estabelecimento.create({
      data: {
        vendedor_id,
        ...data,
      },
    });
  }

  async desatribuirEstabelecimento(
    vendedor_id: string,
    estabelecimento_id: number,
  ): Promise<void> {
    await this.findOrThrow(vendedor_id);

    const estabelecimento = await this.database.estabelecimento.findUnique({
      where: { estabelecimento_id, vendedor_id },
    });

    if (!estabelecimento)
      throw new BadRequestException(
        'Estabelecimento não está atribuido para este vendedor.',
      );

    await this.database.estabelecimento.delete({
      where: { estabelecimento_id, vendedor_id },
    });
  }

  async estabelecimentosAtribuidoPara(
    vendedor_id: string,
    params: { page: number },
  ): Promise<PaginatedDto<EstabelecimentoDto>> {
    const page = params.page ?? 1;
    const size = 100;

    await this.findOrThrow(vendedor_id);

    const total = await this.database.estabelecimento.count({
      where: { vendedor_id },
    });
    const estabelecimentos = await this.database.estabelecimento.findMany({
      where: {
        vendedor_id,
      },
      orderBy: {
        estabelecimento_id: 'asc',
      },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      page,
      size,
      total,
      results: estabelecimentos,
    };
  }

  async atualizarTaxaComissao({
    estabelecimento_id,
    vendedor_id,
    data,
  }: {
    vendedor_id: string;
    estabelecimento_id: number;
    data: AlterarTaxaComissaoDto;
  }) {
    const estabelecimento = await this.database.estabelecimento.findUnique({
      where: { estabelecimento_id, vendedor_id },
    });
    if (!estabelecimento)
      throw new BadRequestException(
        'Estabelecimento não está atribuido para este vendedor.',
      );

    await this.database.estabelecimento.update({
      where: { estabelecimento_id, vendedor_id },
      data,
    });
  }

  async recebimentosLiquidados(
    vendedor_id: string,
    query: RecebimentosQueryDto,
  ): Promise<VendedorRecebimentosDto> {
    const estabelecimentos = await this.database.estabelecimento.findMany({
      where: { vendedor_id },
    });

    const recebimentos = await Promise.all(
      estabelecimentos.map(async (estabelecimento) => {
        const recebimentoCeoPag = await this.apiCeoPag.recebimentosLiquidados({
          mid: estabelecimento.estabelecimento_id,
          ...query,
        });

        const taxa_comissao = estabelecimento.taxa_comissao / 100;
        const mdr = Math.round(recebimentoCeoPag.totais.mdr * taxa_comissao);

        return {
          ...estabelecimento,
          tpv: recebimentoCeoPag.totais.gross_amount,
          mdr,
          rav: recebimentoCeoPag.totais.rav,
          liquido: recebimentoCeoPag.totais.net_amount,
        };
      }),
    );

    return {
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
      recebimentos,
    };
  }

  async estabelecimentoRecebimentosLiquidados(
    estabelecimento_id: number,
    query: RecebimentosQueryDto,
  ): Promise<EstabelecimentoRecebimentosDto> {
    const estabelecimento = await this.database.estabelecimento.findUnique({
      where: { estabelecimento_id },
    });
    if (!estabelecimento)
      throw new BadRequestException('Atribua o estabelecimento a um vendedor');

    const recebimentoCeoPag = await this.apiCeoPag.recebimentosLiquidados({
      mid: estabelecimento_id,
      ...query,
    });

    const taxa_comissao = estabelecimento.taxa_comissao / 100;
    const recebimentos = recebimentoCeoPag.paids.data.map((paid) => ({
      data_recebimento: paid.payment_date,
      tpv: paid.gross_amount,
      mdr: Math.round(paid.mdr * taxa_comissao),
      rav: paid.rav,
      liquido: paid.net_amount,
    }));

    return {
      totais: {
        tpv: recebimentoCeoPag.totais.gross_amount,
        mdr: Math.round(recebimentoCeoPag.totais.mdr * taxa_comissao),
        rav: recebimentoCeoPag.totais.rav,
        liquido: recebimentoCeoPag.totais.net_amount,
      },
      recebimentos,
      page: recebimentoCeoPag.paids.total,
      total: recebimentoCeoPag.paids.total,
      total_pages: recebimentoCeoPag.paids.total_pages,
      next_page: recebimentoCeoPag.paids.next_page,
      per_page: recebimentoCeoPag.paids.per_page,
    };
  }
}
