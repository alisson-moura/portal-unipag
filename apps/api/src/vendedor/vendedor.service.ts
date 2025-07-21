import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@prisma/client';
import { CreateIndicacaoDto } from './dto/create-indicacao.dto';
import { UpdateIndicacaoDto } from './dto/update-indicacao.dto';

@Injectable()
export class VendedorService {
  constructor(private database: PrismaService) {}

  private async findOrThrow(id: string): Promise<Usuario> {
    const vendedor = await this.database.usuario.findUnique({
      where: { id, role: 'VENDEDOR', ativo: true },
    });
    if (!vendedor) {
      throw new NotFoundException(`Vendedor com ID "${id}" não encontrado.`);
    }
    return vendedor;
  }

  async findAll() {
    const vendedores = await this.database.usuario.findMany({
      where: {
        role: 'VENDEDOR',
      },
      orderBy: {
        criado_em: 'asc',
      },
    });

    return vendedores;
  }

  async criarIndicacao(
    vendedor_id: string,
    data: CreateIndicacaoDto,
  ): Promise<void> {
    await this.findOrThrow(vendedor_id);

    // 1. Verifica se o estabelecimento existe
    const estabelecimento =
      await this.database.estabelecimentoCeoPag.findUnique({
        where: { id: data.estabelecimento_id },
      });
    if (!estabelecimento) {
      throw new NotFoundException(
        `Estabelecimento com ID "${data.estabelecimento_id}" não encontrado.`,
      );
    }

    // 2. Verifica se o estabelecimento JÁ POSSUI uma indicação
    const indicacaoExistente = await this.database.indicacao.findUnique({
      where: {
        estabelecimento_id: data.estabelecimento_id,
      },
    });

    if (indicacaoExistente) {
      throw new BadRequestException(
        'Este estabelecimento já foi indicado por um vendedor.',
      );
    }

    // 3. Cria a indicação
    await this.database.indicacao.create({
      data: {
        usuario_id: vendedor_id,
        estabelecimento_id: data.estabelecimento_id,
        taxa_comissao: data.taxa_comissao,
      },
    });
  }

  async removerIndicacao(
    vendedor_id: string,
    estabelecimento_id: string,
  ): Promise<void> {
    await this.findOrThrow(vendedor_id);

    // Encontra a indicação específica para este vendedor e estabelecimento
    const indicacao = await this.database.indicacao.findFirst({
      where: {
        estabelecimento_id: estabelecimento_id,
        usuario_id: vendedor_id,
      },
    });

    if (!indicacao) {
      throw new NotFoundException(
        'Vínculo entre este vendedor e estabelecimento não encontrado.',
      );
    }

    await this.database.indicacao.delete({
      where: { id: indicacao.id },
    });
  }

  async listarIndicacoesPorVendedor(vendedor_id: string) {
    await this.findOrThrow(vendedor_id);

    const indicacoes = await this.database.indicacao.findMany({
      where: {
        usuario_id: vendedor_id,
      },
      include: {
        estabelecimento: true,
      },
    });

    return indicacoes;
  }

  async atualizarTaxaIndicacao(
    vendedor_id: string,
    estabelecimento_id: string,
    data: UpdateIndicacaoDto,
  ) {
    await this.findOrThrow(vendedor_id);

    const indicacao = await this.database.indicacao.findFirst({
      where: {
        estabelecimento_id: estabelecimento_id,
        usuario_id: vendedor_id,
      },
    });

    if (!indicacao) {
      throw new NotFoundException(
        'Vínculo entre este vendedor e estabelecimento não encontrado.',
      );
    }

    await this.database.indicacao.update({
      where: { id: indicacao.id },
      data: {
        taxa_comissao: data.taxa_comissao,
      },
    });
  }
}
