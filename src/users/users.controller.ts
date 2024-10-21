import { Controller, Post, Body, Get, Query, UseGuards, Put, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '../auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody} from '@nestjs/swagger';

interface CustomRequest {
  user: { username: string };
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
    schema: {
      example: {
        message: 'User registered successfully!',
        user: {
          id: 1,
          login: 'testuser',
          email: 'testuser@test.com',
          age: 25,
          description: 'Test user',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка регистрации',
    schema: {
      example: {
        message: 'Error during registration',
        error: 'Validation error',
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        age: { type: 'integer' },
        description: { type: 'string', maxLength: 1000 },
      },
      required: ['login', 'email', 'password', 'age'],
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { message: 'User registered successfully!', user };
    } catch (error) {
      return { message: 'Error during registration', error };
    }
  }



  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Авторизация успешна.' })
  @ApiResponse({ status: 401, description: 'Неверный логин или пароль.' })
  async login(@Body() { login, password }) {
    const user = await this.authService.validateUser(login, password);
    if (user) {
      const token = await this.authService.login(user);
      return token;
    } else {
      return { message: 'Invalid login or password' };
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile/my')
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя успешно получен.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  async getProfile(@Req() req: CustomRequest) {
    const user = req.user;
    return this.usersService.findByLogin(user.username);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Получение всех пользователей с фильтром и пагинацией' })
  @ApiQuery({ name: 'filterLogin', required: false, description: 'Фильтр по логину' })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы' })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество пользователей на странице' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей успешно получен.',
    schema: {
      example: [
        {
          id: 1,
          login: 'testuser',
          email: 'testuser@test.com',
          age: 25,
          description: 'Test user',
        },
      ],
    },
  })
  async getAllUsers(
    @Query('filterLogin') login: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll({ login, page, limit });
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('update')
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя успешно обновлены.' })
  async updateUser(
    @Query('login') login: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.update(login, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален.' })
  async deleteUser(@Query('login') login: string) {
    return this.usersService.delete(login);
  }
}
