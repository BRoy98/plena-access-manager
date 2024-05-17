import { Test, TestingModule } from '@nestjs/testing';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { Key } from './schemas/key.schema';
import { CreateKeyDto } from './dto/request/create-key.request.dto';
import { UpdateKeyDto } from './dto/request/update-key.request.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('KeysController', () => {
  let controller: KeysController;
  let service: KeysService;

  const mockKeyDocument: Key = {
    _id: 'mockId',
    key: 'mockKey',
    rateLimit: 100,
    expiration: new Date(),
    createdBy: 'admin',
    userId: 'user123',
    disabled: false,
  } as Key;

  const keyArray = [mockKeyDocument];

  const mockKeysService = {
    getKeyDetails: jest.fn().mockResolvedValue(mockKeyDocument),
    disableKey: jest.fn().mockResolvedValue(mockKeyDocument),
    create: jest.fn().mockResolvedValue(mockKeyDocument),
    findAll: jest.fn().mockResolvedValue(keyArray),
    findOne: jest.fn().mockResolvedValue(mockKeyDocument),
    update: jest.fn().mockResolvedValue(mockKeyDocument),
    remove: jest.fn().mockResolvedValue(mockKeyDocument),
    findByKey: jest.fn().mockResolvedValue(mockKeyDocument),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeysController],
      providers: [{ provide: KeysService, useValue: mockKeysService }],
    }).compile();

    controller = module.get<KeysController>(KeysController);
    service = module.get<KeysService>(KeysService);
  });

  describe('getKeyDetails', () => {
    it('should return key details', async () => {
      const result = await controller.getKeyDetails('mockKey');
      expect(result).toEqual(mockKeyDocument);
      expect(service.getKeyDetails).toHaveBeenCalledWith('mockKey');
    });
  });

  describe('disableKey', () => {
    it('should disable a key', async () => {
      const result = await controller.disableKey('mockKey');
      expect(result).toEqual(mockKeyDocument);
      expect(service.disableKey).toHaveBeenCalledWith('mockKey');
    });

    it('should throw BadRequestException if key is already disabled', async () => {
      jest
        .spyOn(service, 'disableKey')
        .mockRejectedValueOnce(new BadRequestException('Key already disabled'));
      await expect(controller.disableKey('mockKey')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a new key', async () => {
      const createKeyDto: CreateKeyDto = {
        rateLimit: 100,
        expiration: new Date(),
        createdBy: 'admin',
        userId: 'user123',
      };

      const result = await controller.create(createKeyDto);
      expect(result).toEqual(mockKeyDocument);
      expect(service.create).toHaveBeenCalledWith(createKeyDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of keys', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(keyArray);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a key by id', async () => {
      const result = await controller.findOne('mockId');
      expect(result).toEqual(mockKeyDocument);
      expect(service.findOne).toHaveBeenCalledWith('mockId');
    });

    it('should throw NotFoundException if key not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Key not found'));
      await expect(controller.findOne('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a key by id', async () => {
      const updateKeyDto: UpdateKeyDto = { rateLimit: 200 };

      const result = await controller.update('mockId', updateKeyDto);
      expect(result).toEqual(mockKeyDocument);
      expect(service.update).toHaveBeenCalledWith('mockId', updateKeyDto);
    });
  });

  describe('remove', () => {
    it('should remove a key by id', async () => {
      const result = await controller.remove('mockId');
      expect(result).toEqual(mockKeyDocument);
      expect(service.remove).toHaveBeenCalledWith('mockId');
    });
  });

  describe('validateKey', () => {
    it('should validate a key', async () => {
      const result = await controller.validateKey({ key: 'mockKey' });
      expect(result).toEqual({
        key: mockKeyDocument.key,
        userId: mockKeyDocument.userId,
        rateLimit: mockKeyDocument.rateLimit,
        expiration: mockKeyDocument.expiration,
        disabled: mockKeyDocument.disabled,
      });
      expect(service.findByKey).toHaveBeenCalledWith('mockKey');
    });

    it('should throw NotFoundException if key is not found', async () => {
      jest
        .spyOn(service, 'findByKey')
        .mockRejectedValueOnce(new NotFoundException('Key not found'));
      await expect(controller.validateKey({ key: 'mockKey' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
