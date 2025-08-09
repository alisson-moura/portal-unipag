import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
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
import { Roles } from 'src/auth/guards';
import { RolesGuard } from 'src/auth/guards';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiOperation({ summary: 'Cadastra um novo usuário no sistema' })
  @ApiCreatedResponse()
  @Roles('ADMINISTRADOR')
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiQuery({
    description: 'filtro da role do usuário',
    name: 'role',
    enum: ['ADMINISTRADOR', 'VENDEDOR', 'GESTOR'],
    required: false,
  })
  @ApiOkResponse({ type: Usuario, isArray: true })
  @Roles('ADMINISTRADOR')
  @Get()
  all(@Query('role') role?: 'ADMINISTRADOR' | 'VENDEDOR' | 'GESTOR') {
    return this.usuarioService.all({ role });
  }

  @ApiOkResponse({ type: Usuario })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
  })
  @ApiOperation({ summary: 'Dados do usuário' })
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'GESTOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza o status' })
  @Roles('ADMINISTRADOR')
  @Patch(':id')
  alterarStatus(@Param('id') id: string, @Body() data: AlterarStatusDto) {
    return this.usuarioService.alterarStatus(id, data);
  }

  @ApiOperation({ summary: 'Redefini a senha do usuário' })
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'GESTOR')
  @Patch(':id/senha')
  redefinirSenha(@Param('id') id: string, @Body() data: RedefinirSenhaDto) {
    return this.usuarioService.redefinirSenha(id, data);
  }
}
