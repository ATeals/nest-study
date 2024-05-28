import { Controller, Get, Inject, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/userDto';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '유저 탐색 API',
    description: '모든 유저를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '유저 목록 조회 성공',
    type: UserDto,
  })
  async findAll() {
    return { message: 'users' };
  }

  @Get(':nickname')
  @ApiOperation({
    summary: '이름 기반 유저 탐색 API',
    description: 'nickname이 일치하는 유저를 조회한다.',
  })
  async findUserByNickname(@Param() { nickname }: Pick<UserDto, 'nickname'>) {
    return this.usersService.getUserByNickname(nickname);
  }
}
