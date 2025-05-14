import { Controller, Get, Query } from '@nestjs/common';
import { TermsService } from './terms.service';
import { Term } from './entities/term.entity';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('category') category?: string,
  ): Promise<Term[]> {
    return this.termsService.search(query, category);
  }
}
