import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {}
