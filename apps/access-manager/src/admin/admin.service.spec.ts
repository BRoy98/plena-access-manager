import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginResponseDto } from './dto/response/login.response.dto';

describe('AdminService', () => {
  let service: AdminService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedAccessToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a valid access token for correct credentials', async () => {
      const username = 'admin';
      const password = 'password';

      const result: LoginResponseDto = await service.login(username, password);

      expect(result).toEqual({ accessToken: 'mockedAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username, role: 'ADMIN' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const username = 'wrongUser';
      const password = 'wrongPassword';

      await expect(service.login(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
