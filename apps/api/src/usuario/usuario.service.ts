import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AlterarStatusDto } from './dto/update-status.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Injectable()
export class UsuarioService {
  constructor(private database: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const emailJaEstaEmUso = await this.database.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });
    if (emailJaEstaEmUso)
      throw new BadRequestException('E-mail já está em uso.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, salt);
    await this.database.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword,
      },
    });
  }

  async all({ role }: { role?: 'ADMINISTRADOR' | 'VENDEDOR' }) {
    const usuarios = await this.database.usuario.findMany({
      where: {
        role,
      },
    });
    return usuarios;
  }

  async findByEmail(email: string) {
    const usuario = await this.database.usuario.findUnique({
      where: { email },
    });
    return usuario;
  }

  async findOne(id: string) {
    const usuario = await this.database.usuario.findUnique({
      where: { id },
      omit: { senha: true },
    });
    if (!usuario) throw new NotFoundException();
    return usuario;
  }

  async alterarStatus(id: string, data: AlterarStatusDto) {
    const usuario = await this.database.usuario.findUnique({
      where: { id },
      include: { indicacoes: true },
    });
    if (!usuario)
      throw new NotFoundException(
        'Não encontramos um usuário com o id informado',
      );

    if (usuario.indicacoes.length > 0)
      throw new BadRequestException(
        'Não é possível alterar o status de um vendedor com estabelecimentos associados.',
      );

    await this.database.usuario.update({
      where: { id },
      data,
    });
  }

  async redefinirSenha(id: string, data: RedefinirSenhaDto) {
    const usuario = await this.database.usuario.findUnique({
      where: { id },
      include: { indicacoes: true },
    });
    if (!usuario)
      throw new NotFoundException(
        'Não encontramos um usuário com o id informado',
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.senha, salt);

    await this.database.usuario.update({
      where: { id },
      data: {
        senha: hashedPassword,
      },
    });
  }
}
