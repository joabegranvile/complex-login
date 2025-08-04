import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from 'src/core/decorators/ispublic';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CheckAbilities } from 'src/core/decorators/check-abilities';
import { Action } from './enums/action.enum';
import { AbilitiesGuard } from './guards/abilities.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @IsPublic()
  async signIn(@Request() req: { user: UserEntity }): Promise<any> {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @Roles(Role.ADMIN)
  @CheckAbilities({ action: Action.MANAGE, subject: 'all' })
  @Get('profile')
  profile(@Request() { user }: { user: UserEntity }) {
    return user;
  }
}
