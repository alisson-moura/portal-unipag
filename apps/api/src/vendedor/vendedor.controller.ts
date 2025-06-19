import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { CreateVendedorDto, VendedorDto } from './dto/vendedor.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api/vendedores')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Post()
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedorService.create(createVendedorDto);
  }

  @ApiOperation({
    summary: 'Atualiza o status de um vendedor',
    description: 'Alterna o status ativo/inativo de um vendedor pelo ID.',
  })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string) {
    return this.vendedorService.updateStatus(id);
  }

  @ApiOkResponse({ type: VendedorDto, isArray: true })
  @Get()
  findAll() {
    return this.vendedorService.findAll();
  }

  @ApiOkResponse({ type: VendedorDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendedorService.findOne(id);
  }
}
