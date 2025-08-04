import { AbilityBuilder, createMongoAbility, ExtractSubjectType, MongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/auth/enums/action.enum';
import { UserEntity } from 'src/users/entities/user.entity';
export type Subjects = 'User' | UserEntity | 'Post' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<MongoAbility<[Action, Subjects]>>(createMongoAbility);

    if (user.getIsAdmin()) {
      can(Action.MANAGE, 'all');
    } else {
      can(Action.READ, 'all');
      can(Action.UPDATE, 'User', { id: user.getId() });
      cannot(Action.DELETE, 'User');
    }

    return build({
      detectSubjectType: (item) =>
        (typeof item === 'string' ? item : item.constructor?.name) as ExtractSubjectType<Subjects>,
    });
  }
}
