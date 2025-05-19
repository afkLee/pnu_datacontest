import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TermsService } from './terms.service';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,  // 
  ) {
    return this.termsService.search(query, category, userId);
  }

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    const answer = await this.termsService.askWithAI(body.question);
    return { answer };
  }

  @Post('sync')
  async syncIndex() {
    return this.termsService.syncAllToElasticsearch();
  }
}
