import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginResponseDto } from './dto/response/login.response.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  describe('login', () => {
    it('should return a valid access token for correct credentials', async () => {
      const loginDto = { username: 'admin', password: 'password' };
      const expectedResponse: LoginResponseDto = {
        accessToken: 'mockedAccessToken',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(service.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { username: 'wrongUser', password: 'wrongPassword' };

      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
