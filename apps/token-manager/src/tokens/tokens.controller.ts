import { Controller, Post, Headers } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Token } from './schemas/token.schema';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('request')
  async requestToken(@Headers('x-api-key') key: string): Promise<Token> {
    return this.tokensService.requestToken({ key });
  }
}
