import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TermsService } from './terms.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('terms')
@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('search')
  @ApiOperation({ summary: '용어 검색', description: '용어와 카테고리로 검색' })
  @ApiQuery({ name: 'query', description: '검색어', type: String, required: true })
  @ApiQuery({ name: 'category', description: '카테고리 (선택)', type: String, required: false })
  @ApiQuery({ name: 'userId', description: '사용자 ID (즐겨찾기 포함 여부)', type: String, required: false })
  @ApiResponse({ status: 200, description: '검색 결과 반환' })
  async search(
    @Query('query') query: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,
  ) {
    return this.termsService.search(query, category, userId);
  }

  @Post('ask')
  @ApiOperation({ summary: 'AI 설명 요청', description: '용어에 대한 AI 설명 요청' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string', example: '주강이 뭐야?' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'AI 답변 반환',
    schema: {
      example: { answer: '주강은 주조로 제작된 강철입니다.' },
    },
  })
  async ask(@Body() body: { question: string }) {
    const answer = await this.termsService.askWithAI(body.question);
    return { answer };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Elasticsearch 색인 동기화', description: 'DB 데이터를 Elasticsearch에 동기화' })
  @ApiResponse({ status: 200, description: '색인 동기화 완료' })
  async syncIndex() {
    return this.termsService.syncAllToElasticsearch();
  }
}
