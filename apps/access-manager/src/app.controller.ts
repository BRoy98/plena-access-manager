import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KeysService } from './keys/keys.service';

@Controller()
export class AppController {
  constructor(private readonly keysService: KeysService) {}

  @MessagePattern({ cmd: 'validate_key' })
  async validateKey(data: { key: string }): Promise<any> {
    const keyDocument = await this.keysService.findByKey(data.key);
    return {
      rateLimit: keyDocument.rateLimit,
      expiration: keyDocument.expiration,
      disabled: keyDocument.disabled,
    };
  }
}
