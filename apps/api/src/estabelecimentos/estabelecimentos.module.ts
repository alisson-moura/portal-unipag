import { Module } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import { EstabelecimentosController } from './estabelecimentos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EstabelecimentosController],
  providers: [EstabelecimentosService],
})
export class EstabelecimentosModule {}
