import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { Key, KeyDocument } from './schemas/key.schema';
import { DisableKeyDto } from './dto/disable-key.dto';

@Injectable()
export class KeysService {
  constructor(@InjectModel(Key.name) private keyModel: Model<KeyDocument>) {}

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    return this.keyModel.create(createKeyDto);
  }

  async findAll(): Promise<Key[]> {
    return this.keyModel.find();
  }

  async findOne(id: string): Promise<Key> {
    return this.keyModel.findById(id);
  }

  async update(id: string, updateKeyDto: UpdateKeyDto): Promise<Key> {
    return this.keyModel.findByIdAndUpdate(id, updateKeyDto, { new: true });
  }

  async remove(id: string): Promise<Key> {
    return this.keyModel.findByIdAndDelete(id);
  }

  async findByKey(key: string): Promise<Key> {
    const keyDocument = await this.keyModel.findOne({ key });
    if (!keyDocument) {
      throw new NotFoundException('Key not found');
    }
    return keyDocument;
  }

  async disableKey(disableKeyDto: DisableKeyDto): Promise<Key> {
    const keyDocument = await this.keyModel.findOne({ key: disableKeyDto.key });

    if (!keyDocument) {
      throw new NotFoundException('Key not found');
    }
    if (keyDocument.disabled) {
      throw new BadRequestException('Key already disabled');
    }

    keyDocument.disabled = true;
    return keyDocument.save();
  }
}
