import { Module } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CeopagModule } from 'src/ceopag/ceopag.module';

@Module({
  imports: [PrismaModule, CeopagModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
