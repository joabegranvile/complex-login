import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/auth/enums/action.enum';

export interface RequiredAbility {
  action: Action;
  subject: any;
}

export const CHECK_ABILITIES = 'check_abilities';

export const CheckAbilities = (...abilities: RequiredAbility[]) => SetMetadata(CHECK_ABILITIES, abilities);
