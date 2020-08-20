import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity'
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), AuthModule]
})
export class CoffeesModule { }
