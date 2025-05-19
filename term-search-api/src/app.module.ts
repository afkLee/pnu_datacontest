import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch'; // ✅ 추가

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TermsModule } from './terms/terms.module';
import { FavoritesModule } from './favorites/favorites.module'; // ✅ 중복된 service/controller 제거

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_URL, // ✅ Elasticsearch 서버 주소
    }),
    TermsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
