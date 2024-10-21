import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findByLogin(login: string): Promise<User> {
    return this.usersRepository.findOne({ where: { login } });
  }

  async findAll({ login, page, limit }: { login?: string; page: number; limit: number }): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (login) {
      query.where('user.login LIKE :login', { login: `%${login}%` });
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async update(login: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findByLogin(login);

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async delete(login: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete({ login });

    if (result.affected === 0) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
