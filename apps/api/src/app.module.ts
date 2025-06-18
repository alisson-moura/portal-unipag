import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from "node:path";

@Module({
  imports: [ServeStaticModule.forRoot({
    exclude: ["/api*"],
    rootPath: join(__dirname, "..", "public")
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
