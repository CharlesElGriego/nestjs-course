import { Repository, EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { SERVER_ERROR } from "src/enum/server-error.enum";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === SERVER_ERROR.DUPLICATE) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}