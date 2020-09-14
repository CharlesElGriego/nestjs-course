import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { Event } from '../../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
//class MockCoffeesService {}
// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create(): string[] {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    AuthModule,
    ConfigModule.forFeature(coffeesConfig),
  ],
  exports: [CoffeesService],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,

    //**Type non class based provider token
    {
      provide: COFFEE_BRANDS, //
      useValue: ['buddy brew', 'nescafe'], // array of coffee brands,
    },

    // **Type Factory Providers
    // {
    //   provide: COFFEE_BRANDS,
    //   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    //   useFactory: (brandsFactory: CoffeeBrandsFactory) =>
    //     brandsFactory.create(),
    //   inject: [CoffeeBrandsFactory],
    // },

    // **Type Factory Providers as Async Providers
    // {
    //   provide: 'COFFEE_BRANDS',
    //   // Note "async" here, and Promise/Async event inside the Factory function
    //   // Could be a database connection / API call / etc
    //   // In our case we're just "mocking" this type of event with a Promise
    //   useFactory: async (connection: Connection): Promise<string[]> => {
    //     // const coffeeBrands = await connection.query('SELECT * ...');
    //     console.log('Async Factory!');
    //     const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
    //     return coffeeBrands;
    //   },
    //   inject: [Connection],
    // },
    // **ype Class Provider
    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService,
    // },
  ],
  // providers: [
  //   {
  //     provide: CoffeesService,
  //     useValue: new MockCoffeesService(), // <-- mock implementation
  //   },
  // ],
})
export class CoffeesModule {}
