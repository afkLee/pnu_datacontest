// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  CORS 허용 설정
  app.enableCors({
    origin: '*',  // 모든 Origin 허용 (필요시 특정 Origin만 허용 가능)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('PNU Data Contest API')
    .setDescription('산업용어 및 즐겨찾기 API 문서')
    .setVersion('1.0')
    .addTag('terms')
    .addTag('favorites')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
