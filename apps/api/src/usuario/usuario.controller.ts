import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Usuario } from './dto/usuario.dto';
import { AlterarStatusDto } from './dto/update-status.dto';

@ApiBearerAuth()
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiOperation({ summary: 'Cadastra um novo usuário no sistema' })
  @ApiCreatedResponse()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiOkResponse({ type: Usuario })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
  })
  @ApiOperation({ summary: 'Dados do usuário' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza o status' })
  @Patch(':id')
  alterarStatus(@Param('id') id: string, @Body() data: AlterarStatusDto) {
    return this.usuarioService.alterarStatus(id, data);
  }
}
