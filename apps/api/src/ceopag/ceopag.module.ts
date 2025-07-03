import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiCeoPagService } from './api.service';
import { CeoPagController } from './controler';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [ApiCeoPagService],
  controllers: [CeoPagController],
  exports: [ApiCeoPagService],
})
export class CeopagModule {}
