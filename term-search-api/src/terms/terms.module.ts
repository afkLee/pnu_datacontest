import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { Term } from './entities/term.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Term, Favorite]),  // DB 연결
  ElasticsearchModule.register({   
      node: 'http://localhost:9200',
    }),
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
