import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CHECK_ABILITIES, RequiredAbility } from 'src/core/decorators/check-abilities';
import { UserEntity } from 'src/users/entities/user.entity';
import { JsonSerializer } from 'typescript-json-serializer';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  private serializer = new JsonSerializer();
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredAbilities = this.reflector.getAllAndOverride<RequiredAbility[]>(CHECK_ABILITIES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredAbilities) return true;

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = this.serializer.deserializeObject(request.user, UserEntity);
    const ability: AppAbility = this.caslAbilityFactory.createForUser(user);

    const hasAbility = requiredAbilities.every(({ action, subject }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return ability.can(action, subject);
    });

    if (!hasAbility) throw new ForbiddenException('Forbidden resource');
    return true;
  }
}
