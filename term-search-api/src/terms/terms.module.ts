import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { Term } from './entities/term.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    TypeOrmModule.forFeature([Term, Favorite]),    
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
    }),
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule implements OnModuleInit {
  constructor(private readonly termsService: TermsService) {}

  async onModuleInit() {
    const result = await this.termsService.syncAllToElasticsearch();
    console.log('📦 Elasticsearch 색인 완료:', result);
  }
}
