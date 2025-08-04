import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async signIn(user: UserEntity) {
    const payload = { sub: user.getId(), user: user };
    return {
      token: await this.jwtService.signAsync(payload),
      expiresIn: 60 * 60 * 24,
    };
  }

  validateUser(username: string, password: string): UserEntity | null {
    const user = this.usersService.findOne(username);
    if (!user || !user.isPasswordValid(password)) throw new UnauthorizedException();
    return user;
  }
}
