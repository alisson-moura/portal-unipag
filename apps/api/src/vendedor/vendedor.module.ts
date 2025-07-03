import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { VendedorController } from './vendedor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CeopagModule } from 'src/ceopag/ceopag.module';

@Module({
  imports: [PrismaModule, CeopagModule],
  controllers: [VendedorController],
  providers: [VendedorService],
  exports: [VendedorService],
})
export class VendedorModule {}
