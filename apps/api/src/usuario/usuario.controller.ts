import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Usuario } from './dto/usuario.dto';
import { AlterarStatusDto } from './dto/update-status.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

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

  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiQuery({
    description: 'filtro da role do usuário',
    name: 'role',
    enum: ['ADMINISTRADOR', 'VENDEDOR'],
    required: false,
  })
  @ApiOkResponse({ type: Usuario, isArray: true })
  @Get()
  all(@Query('role') role?: 'ADMINISTRADOR' | 'VENDEDOR') {
    return this.usuarioService.all({ role });
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

  @ApiOperation({ summary: 'Redefini a senha do usuário' })
  @Patch(':id/senha')
  redefinirSenha(@Param('id') id: string, @Body() data: RedefinirSenhaDto) {
    return this.usuarioService.redefinirSenha(id, data);
  }
}
