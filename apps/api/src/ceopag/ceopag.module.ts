import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiCeoPagService } from './api.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SincronizadorCeoPag } from './sincronizador.task';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [ApiCeoPagService, SincronizadorCeoPag],
  exports: [ApiCeoPagService],
})
export class CeopagModule {}
