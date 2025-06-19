import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VendedorDto, CreateVendedorDto } from './dto/vendedor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendedorService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVendedorDto) {
    const emailJaEstaEmUso = await this.prisma.vendedor.findUnique({
      where: { email: data.email },
    });
    if (emailJaEstaEmUso)
      throw new BadRequestException(`Email "${data.email}" já está em uso.`);
    return this.prisma.vendedor.create({ data });
  }

  async updateStatus(id: string) {
    const vendedor = await this.findOne(id);
    if (vendedor.estabelecimentos.length > 0)
      throw new BadRequestException(
        'Não é possível alterar o status de um vendedor com estabelecimentos associados.',
      );
    await this.prisma.vendedor.update({
      where: { id },
      data: { ativo: { set: !vendedor.ativo } },
    });
  }

  async findAll(): Promise<VendedorDto[]> {
    return this.prisma.vendedor.findMany({
      include: { estabelecimentos: true },
      orderBy: { data_contratacao: 'asc' },
    });
  }

  async findOne(id: string): Promise<VendedorDto> {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { id },
      include: { estabelecimentos: true },
    });
    if (!vendedor) {
      throw new NotFoundException(`Vendedor com ID "${id}" não encontrado.`);
    }
    return vendedor;
  }
}
