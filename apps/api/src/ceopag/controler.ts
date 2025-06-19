import { Controller, Get } from '@nestjs/common';
import { ApiCeoPagService } from './api.service';

@Controller('api/ceopag')
export class CeoPagController {
  constructor(private readonly apiService: ApiCeoPagService) {}

  @Get('estabelecimentos')
  getEstabelecimentos() {
    return this.apiService.listarEstabelecimentos({
      pageSize: 1000,
      page: 1,
    });
  }
}
