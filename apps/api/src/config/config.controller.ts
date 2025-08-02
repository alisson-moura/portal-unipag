import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaxaAdministrativaResponseDto } from './dto/taxa-administrativa.dto';
import { UpdateTaxaDto } from './dto/update-taxa.dto';
import { Roles, RolesGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Configurações')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('configs')
export class ConfiguracoesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('taxas')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Obter a taxa administrativa atual' })
  @ApiResponse({
    status: 200,
    description: 'Taxa administrativa retornada com sucesso.',
    type: TaxaAdministrativaResponseDto,
  })
  async getTaxaAdministrativa(): Promise<TaxaAdministrativaResponseDto> {
    const taxa = await this.prisma.taxaAdministrativa.findFirst();

    if (!taxa) {
      throw new NotFoundException('Nenhuma taxa administrativa configurada.');
    }

    return {
      taxa_administrativa: taxa,
    };
  }

  @Put('taxas/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Atualizar a taxa administrativa' })
  @ApiParam({
    name: 'id',
    description: 'ID da taxa a ser atualizada',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Taxa administrativa atualizada com sucesso.',
    type: TaxaAdministrativaResponseDto,
  })
  async putTaxaAdministrativa(
    @Param('id') id: string,
    @Body() body: UpdateTaxaDto,
  ): Promise<TaxaAdministrativaResponseDto> {
    const taxaExistente = await this.prisma.taxaAdministrativa.findUnique({
      where: { id },
    });

    if (!taxaExistente) {
      throw new NotFoundException('Taxa administrativa não encontrada.');
    }

    const taxaAtualizada = await this.prisma.taxaAdministrativa.update({
      where: { id },
      data: {
        taxa: body.taxa,
        atualizado_em: new Date(),
      },
    });

    return {
      taxa_administrativa: taxaAtualizada,
    };
  }
}
