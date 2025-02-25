import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config(); // Load env
  const app = await NestFactory.create(AppModule);

  //  Setup swagger
  const config = new DocumentBuilder()
    .setTitle('Education System API')
    .setDescription('API endpoint for Education System')
    .setVersion('1.0')
    .addTag('EDU_SYS')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.setGlobalPrefix('api') // All routes prefixed with /api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
