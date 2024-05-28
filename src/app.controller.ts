import { Controller, Get } from '@nestjs/common';
import { TypeSafeConfigService } from './config/config.service';

@Controller('/api')
export class AppController {
  constructor(private readonly con: TypeSafeConfigService) {}

  @Get()
  getHello() {
    return { data: 'Hello World!' };
  }
}
