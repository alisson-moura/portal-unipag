import {join} from "node:path";
import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CeopagModule} from './ceopag/ceopag.module';
import {ConfigModule} from '@nestjs/config';
import {envSchema} from './config/env.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (config) => {
                try {
                    return envSchema.parse(config);
                } catch (error) {
                    console.error('❌ Variáveis de ambiente inválidas:', error.errors);
                    throw new Error('Variáveis de ambiente inválidas');
                }
            },
        }),
        ServeStaticModule.forRoot({
            exclude: ["/api*"],
            rootPath: join(__dirname, "..", "public")
        }),
        CeopagModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
