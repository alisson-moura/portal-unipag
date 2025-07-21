import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstabelecimentosService {
  constructor(private prismaService: PrismaService) {}
  findAll(vendedorId?: string) {
    return this.prismaService.estabelecimentoCeoPag.findMany({
      where: {
        indicacao: {
          usuario_id: vendedorId,
        },
      },
      include: {
        indicacao: true,
      },
    });
  }
}
