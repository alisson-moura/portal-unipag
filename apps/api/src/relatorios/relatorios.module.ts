import { Module } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CeopagModule } from 'src/ceopag/ceopag.module';
import { VendedorModule } from 'src/vendedor/vendedor.module';

@Module({
  imports: [PrismaModule, CeopagModule, VendedorModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
