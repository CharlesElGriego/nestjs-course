import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({})
// Creating static register() method on DatabaseModule
// Improved Dynamic Module way of creating CONNECTION provider
// so others modules can control
export class DatabaseModule {
  //Dynamic Module
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION', //
          useValue: createConnection(options),
        },
      ],
    };
  }
}
