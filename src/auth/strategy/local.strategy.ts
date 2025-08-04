import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  validate(username: string, password: string): UserEntity {
    const hasUser = this.authService.validateUser(username, password);
    if (!hasUser) {
      throw new Error('Invalid credentials');
    }
    return hasUser;
  }
}
