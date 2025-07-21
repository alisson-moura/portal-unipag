import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstabelecimentosService {
  constructor(private prismaService: PrismaService) {}
  findAll() {
    return this.prismaService.estabelecimentoCeoPag.findMany({
      include: {
        indicacao: true,
      },
    });
  }
}
