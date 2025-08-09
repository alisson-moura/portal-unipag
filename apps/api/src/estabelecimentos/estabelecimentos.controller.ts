import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { EstabelecimentoDto } from './dto/estabelecimento.dto';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/guards';
import { UserPayloadDto } from 'src/auth/auth.dto';
import { AtribuirGestorDto } from './dto/atribuir-gestor.dto';

@ApiTags('Estabelecimentos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('estabelecimentos')
export class EstabelecimentosController {
  constructor(
    private readonly estabelecimentosService: EstabelecimentosService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os estabelecimentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estabelecimentos retornada com sucesso.',
    type: EstabelecimentoDto,
    isArray: true,
  })
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  findAll(@Req() req: { user: UserPayloadDto }) {
    const { user } = req;
    if (user.role === 'VENDEDOR') {
      return this.estabelecimentosService.findAll(user.id);
    }
    return this.estabelecimentosService.findAll();
  }

  @Post('gestor')
  @Roles('ADMINISTRADOR')
  @ApiCreatedResponse()
  atribuirGestor(@Body() data: AtribuirGestorDto) {
    return this.estabelecimentosService.atribuirGestor(data);
  }

  @Delete(':id/gestor')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Remover gestor de um estabelecimento' })
  @ApiResponse({ status: 200, description: 'Gestor removido com sucesso.' })
  removerGestor(@Param('id') estabelecimentoId: string) {
    return this.estabelecimentosService.removerGestor(estabelecimentoId);
  }
}
