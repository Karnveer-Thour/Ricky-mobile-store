import { UserRepository } from './Repositories/User.repo';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'Core/Firebase/firebase.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        { provide: FirebaseService, useValue: { verifyToken: jest.fn() } }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
