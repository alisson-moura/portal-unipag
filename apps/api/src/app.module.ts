import { join } from 'node:path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CeopagModule } from './ceopag/ceopag.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EstabelecimentosModule } from './estabelecimentos/estabelecimentos.module';
import { LoggerMiddleware } from './config/log-middleware';

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
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    PrismaModule,
    AuthModule,
    CeopagModule,
    UsuarioModule,
    VendedorModule,
    RelatoriosModule,
    EstabelecimentosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
