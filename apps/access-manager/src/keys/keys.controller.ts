import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeysService } from './keys.service';
import { Key } from './schemas/key.schema';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { DisableKeyDto } from './dto/disable-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createKeyDto: CreateKeyDto): Promise<Key> {
    return this.keysService.create(createKeyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
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

  @Post('details')
  async getDetails(@Body() body: { key: string }): Promise<Key> {
    const keyDocument = await this.keysService.findByKey(body.key);
    if (keyDocument.disabled) {
      throw new BadRequestException('Key is disabled');
    }
    return keyDocument;
  }

  // User Query: Disable key
  @Post('disable')
  disable(@Body() disableKeyDto: DisableKeyDto): Promise<Key> {
    return this.keysService.disableKey(disableKeyDto);
  }
}
