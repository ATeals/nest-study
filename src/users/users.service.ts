import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entites/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async create(
    userObject: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ): Promise<UsersModel> {
    const userExists = await this.usersRepository.exists({
      where: { email: userObject.email },
    });

    if (userExists) throw new BadRequestException('User email already exists');

    const nicknameExist = await this.usersRepository.exists({
      where: { nickname: userObject.nickname },
    });

    if (nicknameExist)
      throw new BadRequestException('User nickname already exists');

    const user = this.usersRepository.create(userObject);

    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  getUserByNickname(nickname: string) {
    return this.usersRepository.findOne({ where: { nickname } });
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
