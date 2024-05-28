import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeSafeConfigModule } from './config/config.module';
import { TypeSafeConfigService } from './config/config.service';

@Module({
  imports: [
    TypeSafeConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeSafeConfigModule],
      inject: [TypeSafeConfigService],
      useFactory: (config: TypeSafeConfigService) => ({
        type: 'postgres',
        host: config.get('db.host'),
        port: config.get('db.port'),
        username: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.name'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
