import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateIndicacaoDto } from './dto/create-indicacao.dto';
import { UpdateIndicacaoDto } from './dto/update-indicacao.dto';
import { VendedorResponseDto } from './dto/vendedor-response.dto';
import { IndicacaoResponseDto } from './dto/indicacao-response.dto';

@ApiTags('Vendedores')
@ApiBearerAuth()
@Controller('vendedores')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista todos os vendedores',
    description:
      'Retorna uma lista de todos os usuários com a role "VENDEDOR".',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendedores retornada com sucesso.',
    type: VendedorResponseDto,
    isArray: true,
  })
  findAll() {
    return this.vendedorService.findAll();
  }

  @Post(':vendedorId/indicacoes')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Cria um novo vínculo (indicação) entre um vendedor e um estabelecimento.',
  })
  @ApiParam({
    name: 'vendedorId',
    description: 'UUID do vendedor',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: CreateIndicacaoDto })
  criarIndicacao(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
    @Body() data: CreateIndicacaoDto,
  ) {
    return this.vendedorService.criarIndicacao(vendedorId, data);
  }

  @Get(':vendedorId/indicacoes')
  @ApiOperation({
    summary: 'Lista todos os estabelecimentos indicados por um vendedor.',
  })
  @ApiParam({
    name: 'vendedorId',
    description: 'UUID do vendedor',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de indicações retornada com sucesso.',
    type: IndicacaoResponseDto,
    isArray: true,
  })
  listarIndicacoesPorVendedor(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
  ) {
    return this.vendedorService.listarIndicacoesPorVendedor(vendedorId);
  }

  @Patch(':vendedorId/indicacoes/:estabelecimentoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualiza a taxa de comissão de uma indicação específica.',
  })
  @ApiParam({
    name: 'vendedorId',
    description: 'UUID do vendedor',
    type: String,
  })
  @ApiParam({
    name: 'estabelecimentoId',
    description: 'UUID do estabelecimento',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Taxa de comissão atualizada com sucesso.',
  })
  atualizarTaxaIndicacao(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
    @Param('estabelecimentoId', ParseUUIDPipe) estabelecimentoId: string,
    @Body() data: UpdateIndicacaoDto,
  ) {
    return this.vendedorService.atualizarTaxaIndicacao(
      vendedorId,
      estabelecimentoId,
      data,
    );
  }

  @Delete(':vendedorId/indicacoes/:estabelecimentoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Remove o vínculo (indicação) entre um vendedor e um estabelecimento.',
  })
  @ApiParam({
    name: 'vendedorId',
    description: 'UUID do vendedor',
    type: String,
  })
  @ApiParam({
    name: 'estabelecimentoId',
    description: 'UUID do estabelecimento',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Vínculo removido com sucesso.' })
  removerIndicacao(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
    @Param('estabelecimentoId', ParseUUIDPipe) estabelecimentoId: string,
  ) {
    return this.vendedorService.removerIndicacao(vendedorId, estabelecimentoId);
  }
}
