import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtribuirGestorDto } from './dto/atribuir-gestor.dto';

@Injectable()
export class EstabelecimentosService {
  constructor(private prismaService: PrismaService) {}
  findAll(usuarioId?: string) {
    return this.prismaService.estabelecimentoCeoPag.findMany({
      where: {
        indicacao: {
          usuario_id: usuarioId,
        },
        gestor_id: usuarioId,
      },
      include: {
        indicacao: true,
        gestor: true,
      },
    });
  }

  findAllByGestor(gestorId: string) {
    return this.prismaService.estabelecimentoCeoPag.findMany({
      where: {
        gestor_id: gestorId,
      },
      include: {
        indicacao: true,
        gestor: true,
      },
    });
  }

  async atribuirGestor(data: AtribuirGestorDto): Promise<void> {
    await this.prismaService.estabelecimentoCeoPag.update({
      where: {
        id: data.estabelecimentoId,
      },
      data: {
        gestor_id: data.gestorId,
      },
    });
  }

  async removerGestor(estabelecimentoId: string) {
    await this.prismaService.estabelecimentoCeoPag.update({
      where: { id: estabelecimentoId },
      data: { gestor_id: null },
    });
  }
}
