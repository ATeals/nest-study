import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { TypeSafeConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [TypeSafeConfigService],
  exports: [TypeSafeConfigService],
})
export class TypeSafeConfigModule {}
