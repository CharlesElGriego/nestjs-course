/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
@UseGuards(AuthGuard())
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  // @Get()
  // findAll(@Res() response) {
  //   // Express.js example using status() and send() methods
  //   response.status(200).send('Holas action returns all coffees'); // DONT, harder to test
  // }

  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Coffee> {
    return await this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createCoffeeDto: CreateCoffeeDto, @GetUser() user: User): any {
    createCoffeeDto.user = user;
    return this.coffeesService.create(createCoffeeDto);
    // return `This action creates a coffee`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    return this.coffeesService.remove(id, user);
  }
}
