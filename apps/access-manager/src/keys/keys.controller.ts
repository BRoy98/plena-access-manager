import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateKeyDto } from './dto/request/create-key.request.dto';
import { UpdateKeyDto } from './dto/request/update-key.request.dto';
import { KeysService } from './keys.service';
import { Key } from './schemas/key.schema';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { ApiKeyAuthGuard } from '../common/auth-user.guard';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @UseGuards(ApiKeyAuthGuard)
  @Get('details')
  getKeyDetails(@Headers('x-api-key') key: string): Promise<Key> {
    return this.keysService.getKeyDetails(key);
  }

  @UseGuards(ApiKeyAuthGuard)
  @Post('disable')
  disableKey(@Headers('x-api-key') key: string): Promise<Key> {
    return this.keysService.disableKey(key);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  create(@Body() createKeyDto: CreateKeyDto): Promise<Key> {
    return this.keysService.create(createKeyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  findAll(): Promise<Key[]> {
    return this.keysService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Key> {
    return this.keysService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ): Promise<Key> {
    return this.keysService.update(id, updateKeyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Key> {
    return this.keysService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_key' })
  async validateKey(data: { key: string }): Promise<any> {
    const keyDocument = await this.keysService.findByKey(data.key);
    return {
      key: keyDocument.key,
      userId: keyDocument.userId,
      rateLimit: keyDocument.rateLimit,
      expiration: keyDocument.expiration,
      disabled: keyDocument.disabled,
    };
  }
}
