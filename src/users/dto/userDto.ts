import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ name: 'nickname' })
  @IsNotEmpty()
  nickname: string;
}
