import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/config/paginated.dto';
import { Usuario } from 'src/usuario/dto/usuario.dto';
import {
  AlterarTaxaComissaoDto,
  AtribuirEstabelecimentoDto,
  EstabelecimentoDto,
} from './dto/estabelecimento.dto';
import {
  EstabelecimentoRecebimentosDto,
  RecebimentosQueryDto,
  VendedorRecebimentosDto,
} from './dto/recebimentos.dto';

@ApiBearerAuth()
@Controller('vendedores')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @ApiPaginatedResponse(Usuario)
  @ApiQuery({
    name: 'page',
    type: Number,
    default: 1,
  })
  @ApiOperation({
    summary: 'Lista todos os vendedores',
  })
  @Get()
  all(@Query('page') page: number) {
    return this.vendedorService.findAll({ page });
  }

  @ApiParam({
    name: 'id',
    description: 'ID do vendedor',
  })
  @ApiOperation({
    summary: 'Atribui um estabelecimento ao vendedor',
  })
  @Post(':id/estabelecimentos')
  atribuirEstabelecimento(
    @Param('id') id: string,
    @Body() data: AtribuirEstabelecimentoDto,
  ) {
    return this.vendedorService.atribuirEstabelecimento(id, data);
  }

  @ApiParam({
    name: 'id',
    description: 'ID do vendedor',
  })
  @ApiParam({
    name: 'estabelecimento_id',
    description: 'ID do estabelecimento',
  })
  @ApiOperation({
    summary: 'Desatribui um estabelecimento do vendedor',
  })
  @Delete(':id/estabelecimentos/:estabelecimento_id')
  desatribuirEstabelecimento(
    @Param('id') id: string,
    @Param('estabelecimento_id') estabelecimento_id: number,
  ) {
    return this.vendedorService.desatribuirEstabelecimento(
      id,
      +estabelecimento_id,
    );
  }

  @ApiPaginatedResponse(EstabelecimentoDto)
  @ApiQuery({
    name: 'page',
    type: Number,
    default: 1,
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vendedor',
  })
  @ApiOperation({
    summary: 'Estabelecimentos atribuidos ao vendedor',
  })
  @Get(':id/estabelecimentos')
  estabelecimentosAtribuidosPara(
    @Param('id') id: string,
    @Query('page') page: number,
  ) {
    return this.vendedorService.estabelecimentosAtribuidoPara(id, { page });
  }

  @ApiOkResponse({ type: VendedorRecebimentosDto })
  @ApiQuery({
    name: 'start_date',
    type: String,
    example: '2025-05-01',
    required: true,
  })
  @ApiQuery({
    name: 'finish_date',
    type: String,
    example: '2025-05-31',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vendedor',
  })
  @ApiOperation({
    summary: 'Recebimentos do vendedor no período informado',
  })
  @Get(':id/recebimentos')
  recebimentos(@Param('id') id: string, @Query() query: RecebimentosQueryDto) {
    return this.vendedorService.recebimentosLiquidados(id, query);
  }

  @ApiOkResponse({ type: EstabelecimentoRecebimentosDto })
  @ApiQuery({
    name: 'page',
    type: Number,
    default: 1,
    required: true,
  })
  @ApiQuery({
    name: 'start_date',
    type: String,
    example: '2025-05-01',
    required: true,
  })
  @ApiQuery({
    name: 'finish_date',
    type: String,
    example: '2025-05-31',
    required: true,
  })
  @ApiParam({
    name: 'estabelecimento_id',
    description: 'ID do estabelecimento',
  })
  @ApiOperation({
    summary: 'Recebimentos do vendedor no estabelecimento e periodo informados',
  })
  @Get('recebimentos/:estabelecimento_id')
  estabelecimentoRecebimentos(
    @Param('estabelecimento_id') estabelecimento_id: number,
    @Query() query: RecebimentosQueryDto,
  ) {
    return this.vendedorService.estabelecimentoRecebimentosLiquidados(
      +estabelecimento_id,
      query,
    );
  }

  @ApiParam({
    name: 'vendedor_id',
    description: 'ID do vendedor',
  })
  @ApiParam({
    name: 'estabelecimento_id',
    description: 'ID do estabelecimento',
  })
  @ApiOperation({
    summary: 'Alterar a taxa de comissão do estabelecimento',
  })
  @Patch(':vendedor_id/estabelecimentos/:estabelecimento_id')
  alterarTaxaComissao(
    @Param('vendedor_id') vendedor_id: string,
    @Param('estabelecimento_id') estabelecimento_id: number,
    @Body() data: AlterarTaxaComissaoDto,
  ) {
    return this.vendedorService.atualizarTaxaComissao({
      vendedor_id,
      estabelecimento_id: +estabelecimento_id,
      data,
    });
  }
}
