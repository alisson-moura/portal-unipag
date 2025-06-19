import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateVendedorDto} from './dto/create-vendedor.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class VendedorService {
    constructor(private prisma: PrismaService) {
    }

    create(data: CreateVendedorDto) {
        return this.prisma.vendedor.create({data})
    }

    async findAll() {
        return this.prisma.vendedor.findMany({
            include: {estabelecimentos: true},
        });
    }

    async findOne(id: string) {
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
