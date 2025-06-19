import { Injectable, NotFoundException } from '@nestjs/common';
import { VendedorDto, CreateVendedorDto } from './dto/vendedor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendedorService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateVendedorDto) {
    return this.prisma.vendedor.create({ data });
  }

  async findAll(): Promise<VendedorDto[]> {
    return this.prisma.vendedor.findMany({
      include: { estabelecimentos: true },
    });
  }

  async findOne(id: string): Promise<VendedorDto | undefined> {
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
