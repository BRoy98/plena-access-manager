import { Controller, Post, Body } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { RequestTokenDto } from './dto/request-token.dto';
import { Token } from './schemas/token.schema';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('request')
  async requestToken(@Body() requestTokenDto: RequestTokenDto): Promise<Token> {
    return this.tokensService.requestToken(requestTokenDto);
  }
}
