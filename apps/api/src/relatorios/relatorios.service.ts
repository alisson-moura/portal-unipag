import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendedorService } from 'src/vendedor/vendedor.service';

@Injectable()
export class RelatoriosService {
  constructor(
    private database: PrismaService,
    private vendedorService: VendedorService,
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
    const total = await this.database.estabelecimento.count();
    return {
      total,
    };
  }

  async totalComissao({
    finish_date,
    start_date,
  }: {
    start_date: string;
    finish_date: string;
  }) {
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
        ativo: true,
      },
    });

    const recebimentosPorVendedor = await Promise.all(
      vendedores.map((vendedor) =>
        this.vendedorService.recebimentosLiquidados(vendedor.id, {
          finish_date,
          start_date,
        }),
      ),
    );

    return {
      total: recebimentosPorVendedor.reduce(
        (acc, current) => current.totais.mdr + acc,
        0,
      ),
    };
  }

  async comissaoVendedores({
    finish_date,
    start_date,
  }: {
    start_date: string;
    finish_date: string;
  }) {
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
        ativo: true,
      },
    });
    const recebimentosPorVendedor = await Promise.all(
      vendedores.map(async (vendedor) => {
        const recebimentos = await this.vendedorService.recebimentosLiquidados(
          vendedor.id,
          {
            finish_date,
            start_date,
          },
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
