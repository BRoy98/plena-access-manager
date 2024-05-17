/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { KeysService } from './keys.service';
import { Key, KeyDocument } from './schemas/key.schema';
import { Model } from 'mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateKeyDto } from './dto/request/create-key.request.dto';
import { UpdateKeyDto } from './dto/request/update-key.request.dto';

describe('KeysService', () => {
  let service: KeysService;
  let model: Model<KeyDocument>;

  const mockKeyDocument = {
    _id: 'mockId',
    key: 'mockKey',
    rateLimit: 100,
    expiration: new Date(),
    createdBy: 'admin',
    userId: 'user123',
    disabled: false,
    save: jest.fn().mockResolvedValue(this),
  } as unknown as KeyDocument;

  const keyArray = [mockKeyDocument] as KeyDocument[];

  const mockKeyModel = {
    new: jest.fn().mockResolvedValue(mockKeyDocument),
    constructor: jest.fn().mockResolvedValue(mockKeyDocument),
    create: jest.fn(),
    find: jest.fn().mockResolvedValue(keyArray),
    findById: jest.fn().mockResolvedValue(mockKeyDocument),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockKeyDocument),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockKeyDocument),
    findOne: jest.fn().mockResolvedValue(mockKeyDocument),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeysService,
        {
          provide: getModelToken(Key.name),
          useValue: mockKeyModel,
        },
      ],
    }).compile();

    service = module.get<KeysService>(KeysService);
    model = module.get<Model<KeyDocument>>(getModelToken(Key.name));
  });

  describe('create', () => {
    it('should create a new key', async () => {
      const createKeyDto: CreateKeyDto = {
        rateLimit: 100,
        expiration: new Date(),
        createdBy: 'admin',
        userId: 'user123',
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockKeyDocument as any));

      const result = await service.create(createKeyDto);

      expect(result).toEqual(mockKeyDocument);
      expect(model.create).toHaveBeenCalledWith(createKeyDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of keys', async () => {
      const result = await service.findAll();

      expect(result).toEqual(keyArray);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a key by id', async () => {
      const result = await service.findOne('mockId');

      expect(result).toEqual(mockKeyDocument);
      expect(model.findById).toHaveBeenCalledWith('mockId');
    });

    it('should throw NotFoundException if key not found', async () => {
      jest
        .spyOn(model, 'findById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(service.findOne('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a key by id', async () => {
      const updateKeyDto: UpdateKeyDto = { rateLimit: 200 };

      const result = await service.update('mockId', updateKeyDto);

      expect(result).toEqual(mockKeyDocument);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockId',
        updateKeyDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should remove a key by id', async () => {
      const result = await service.remove('mockId');

      expect(result).toEqual(mockKeyDocument);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('mockId');
    });
  });

  describe('findByKey', () => {
    it('should return a key by key value', async () => {
      const result = await service.findByKey('mockKey');

      expect(result).toEqual(mockKeyDocument);
      expect(model.findOne).toHaveBeenCalledWith({ key: 'mockKey' });
    });

    it('should throw NotFoundException if key not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findByKey('mockKey')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('disableKey', () => {
    it('should disable a key', async () => {
      jest.spyOn(service, 'findByKey').mockResolvedValue(mockKeyDocument);

      const result = await service.disableKey('mockKey');

      expect(result.disabled).toBe(true);
      expect(mockKeyDocument.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if key already disabled', async () => {
      const disabledKeyDocument = { ...mockKeyDocument, disabled: true };
      jest
        .spyOn(service, 'findByKey')
        .mockResolvedValue(disabledKeyDocument as any);

      await expect(service.disableKey('mockKey')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
