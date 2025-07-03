import { PickType } from '@nestjs/swagger';
import { Usuario } from './usuario.dto';

export class AlterarStatusDto extends PickType(Usuario, ['ativo']) {}
