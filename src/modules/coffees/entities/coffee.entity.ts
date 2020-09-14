import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { Flavor } from './flavor.entity';

@Entity() /// Entity('Coffees') will change the name, it's going to have lowercase by default
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  description: string;

  @JoinTable() // 👈 Join the 2 tables - only the OWNER-side does this
  @ManyToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Flavor,
    flavor => flavor.coffees, // what is "coffee" within the Flavor Entity
    {
      cascade: true, // or optionally just insert or update ['insert']
    },
  ) // 👈
  flavors: Flavor[];

  @Column({ default: 0 })
  recommendations: number;

  @ManyToOne(type => User)
  user: User;
}
