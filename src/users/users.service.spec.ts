import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  it('должен создать пользователя', async () => {
    const user = { login: 'testuser', email: 'test@test.com', password: 'password', age: 25, description: 'Test user' };

    jest.spyOn(repository, 'create').mockReturnValue(user as User);
    jest.spyOn(repository, 'save').mockResolvedValue(user as User);

    expect(await service.create(user)).toEqual(user);
    expect(repository.create).toHaveBeenCalledWith(user);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('должен найти пользователя по логину', async () => {
    const user = { login: 'testuser', email: 'test@test.com', password: 'password', age: 25, description: 'Test user' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

    expect(await service.findByLogin('testuser')).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { login: 'testuser' } });
  });

  it('должен удалить пользователя', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.delete('testuser')).toEqual({ message: 'User deleted successfully' });
    expect(repository.delete).toHaveBeenCalledWith({ login: 'testuser' });
  });

  it('должен бросить ошибку, если пользователь не найден при удалении', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.delete('testuser')).rejects.toThrow('User not found');
  });
});
