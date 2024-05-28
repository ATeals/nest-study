import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVConfiguration, LeafTypes, Leaves } from './configuration';

@Injectable()
export class TypeSafeConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends Leaves<ENVConfiguration>>(
    propertyPath: T,
  ): LeafTypes<ENVConfiguration, T> {
    return this.configService.get(propertyPath);
  }
}
