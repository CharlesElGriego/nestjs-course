import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register(
      {
        secret: 'Scooby-Doo',
        signOptions:{
          expiresIn:3600
        }
      }
    ),
    TypeOrmModule.forFeature([User, UserRepository])],
    exports:[
      JwtStrategy,
      PassportModule.register({defaultStrategy:'jwt'})
    ]
})
export class AuthModule {}
 