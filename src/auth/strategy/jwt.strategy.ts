import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Constants } from 'src/core/constants/constanst';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JsonSerializer } from 'typescript-json-serializer';

interface JwtPayload {
  user: UserEntity;
  sub: number;
  iat: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private serializer = new JsonSerializer();
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constants.JWTSECRET,
    });
  }
  validate(payload: JwtPayload): UserEntity {
    const user = this.serializer.deserializeObject(payload.user, UserEntity);
    const hasUser = this.usersService.findOne(user.getUsername());
    if (!hasUser) throw new UnauthorizedException();
    return user;
  }
}
