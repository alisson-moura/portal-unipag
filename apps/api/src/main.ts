import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpError } from './config/http-error.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Portal Unipag')
    .setDescription('Documentação do portal unipag')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addBearerAuth()
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
      type: HttpError,
    })
    .addGlobalResponse({
      status: 400,
      description: 'Bad request',
      type: HttpError,
    })
    .addGlobalResponse({
      status: 404,
      description: 'Not found',
      type: HttpError,
    })
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
      type: HttpError,
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
  process.exit(1);
});
