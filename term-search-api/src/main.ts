import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('산업용어 검색 API')
    .setDescription('Swagger로 문서화된 산업용어 API입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);  // 여기가 Swagger 문서 경로
  
await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
