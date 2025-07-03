import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CeopagModule } from './ceopag/ceopag.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        try {
          return envSchema.parse(config);
        } catch {
          throw new Error('Variáveis de ambiente inválidas');
        }
      },
    }),
    ServeStaticModule.forRoot({
      exclude: ['/api*'],
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/',
    }),
    PrismaModule,
    AuthModule,
    CeopagModule,
    UsuarioModule,
    VendedorModule,
    RelatoriosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
