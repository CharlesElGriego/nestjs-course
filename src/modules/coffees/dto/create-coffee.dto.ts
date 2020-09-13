import { IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: string[];

  user: User;
}
