import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiCeoPagService } from './api.service';
import { CeoPagController } from './controler';

@Module({
  imports: [HttpModule],
  providers: [ApiCeoPagService],
  controllers: [CeoPagController],
})
export class CeopagModule {}
