import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne( {where: {email}} );
    if (user) {
      return user;
    }
    throw new HttpException(
      '사용자 이메일이 존재하지 않습니다.',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

}
