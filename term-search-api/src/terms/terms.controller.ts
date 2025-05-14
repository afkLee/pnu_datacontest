import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TermsService } from './terms.service';
import { Term } from './entities/term.entity';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // ✅ 1. 검색 API
  // 예: GET /terms/search?query=quen&category=금속
  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('category') category?: string,
  ): Promise<Term[]> {
    return this.termsService.search(query, category);
  }

  // ✅ 2. 질문 응답 API
  // 예: POST /terms/ask { "question": "1차퀜칭이 뭐야?" }
  @Post('ask')
  async ask(@Body() body: { question: string }): Promise<{ answer: string }> {
    const answer = await this.termsService.askWithAI(body.question);
    return { answer };
  }
}
