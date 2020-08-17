import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entitities/coffee.entity';


@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: string) :Coffee{
    const coffee = this.coffees.find(item => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  create(createCoffeeDto: any):void {
   this.coffees.push(createCoffeeDto);
   return createCoffeeDto;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  update(id: string, updateCoffeeDto) :Coffee{
    return updateCoffeeDto;
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      existingCoffee.name = updateCoffeeDto.name;
      return existingCoffee;
    }
    return null;
  }

  remove(id: string) :void{
    const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
