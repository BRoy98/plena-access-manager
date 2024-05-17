import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateKeyDto } from './dto/request/create-key.request.dto';
import { UpdateKeyDto } from './dto/request/update-key.request.dto';
import { Key, KeyDocument } from './schemas/key.schema';

@Injectable()
export class KeysService {
  constructor(@InjectModel(Key.name) private keyModel: Model<KeyDocument>) {}

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    const createdKey = new this.keyModel(createKeyDto);
    return createdKey.save();
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

  async findByKey(key: string): Promise<KeyDocument> {
    const keyDocument = await this.keyModel.findOne({ key });
    if (!keyDocument) {
      throw new NotFoundException('Key not found');
    }
    return keyDocument;
  }

  async getKeyDetails(key: string): Promise<Key> {
    return this.findByKey(key);
  }

  async disableKey(key: string): Promise<Key> {
    const keyDocument = await this.findByKey(key);
    if (keyDocument.disabled) {
      throw new BadRequestException('Key already disabled');
    }
    keyDocument.disabled = true;
    return keyDocument.save();
  }
}
