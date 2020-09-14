import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Event } from '../../events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection, //  @Inject(REQUEST) private request: Request, BE CAREFUL DON'T ADD UNLESS NECESSARY, PERFORMANCE ISSUES
  ) // IT'S GOING TO CREATE A NEW INSTANCE FOR EACH REQUEST
  //  @Inject(COFFEE_BRANDS) coffeeBrands: string[],
  //@Inject(coffeesConfig.KEY)
  //private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  // private readonly configService: ConfigService, // 👈
  {
    // console.log('CoffesBrands: ' + coffeeBrands);
    //const databaseHost = this.configService.get('database.host', 'localhost');
    //  const databaseHost = this.configService.get<string>('DATABASE_HOST', 'localhost');
    //usefull if some key dont work
    // console.log('DataBaseHost: ' + databaseHost);
    //console.log('CoffessConfig:' + coffeesConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOneByUser(id: number, user: User): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
      where: {
        user: user,
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    const newCoffee = await this.coffeeRepository.save(coffee);
    delete newCoffee.user;
    return newCoffee;
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number, user: User): Promise<Coffee> {
    const coffee = await this.findOneByUser(id, user);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}

// Scope DEFAULT - This is assumed when NO Scope is entered like so: @Injectable() */
// @Injectable({ scope: Scope.DEFAULT })
// export class CoffeesService {}

// // -------------

// /**
//  * Scope TRANSIENT

//  * Transient providers are NOT shared across consumers.
//  * Each consumer that injects a transient provider
//  * will receive a new, dedicated instance of that provider.
//  */
// @Injectable({ scope: Scope.TRANSIENT })
// export class CoffeesService {}

// // Scope TRANSIENT with a Custom Provider
// {
//   provide: 'COFFEE_BRANDS',
//   useFactory: () => ['buddy brew', 'nescafe'],
//   scope: Scope.TRANSIENT // 👈
// }

// // -------------

// /**
//  * Scope REQUEST

//  * Request scope provides a new instance of the provider
//  * exclusively for each incoming request.
//  */
// @Injectable({ scope: Scope.REQUEST })
// export class CoffeesService {}
