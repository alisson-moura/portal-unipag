import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import {VendedorService} from './vendedor.service';
import {CreateVendedorDto} from './dto/create-vendedor.dto';

@Controller('api/vendedores')
export class VendedorController {
    constructor(private readonly vendedorService: VendedorService) {
    }

    @Post()
    create(@Body() createVendedorDto: CreateVendedorDto) {
        return this.vendedorService.create(createVendedorDto);
    }

    @Get()
    findAll() {
        return this.vendedorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vendedorService.findOne(id);
    }
}
