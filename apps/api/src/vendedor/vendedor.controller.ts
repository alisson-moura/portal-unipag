import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { CreateVendedorDto, VendedorDto } from './dto/vendedor.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('api/vendedores')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Post()
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedorService.create(createVendedorDto);
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
