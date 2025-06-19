import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CeopagModule } from './ceopag/ceopag.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { VendedorModule } from './vendedor/vendedor.module';

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
    }),
    CeopagModule,
    PrismaModule,
    VendedorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
