import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of a coffee.' })
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly brand: string;

  @ApiProperty()
  @IsString({ each: true })
  readonly flavors: string[];

  user: User;
}
