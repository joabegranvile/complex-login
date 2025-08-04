import { Module } from '@nestjs/common';
import { AbilitiesGuard } from 'src/auth/guards/abilities.guard';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory, AbilitiesGuard],
  exports: [AbilitiesGuard, CaslAbilityFactory],
})
export class CaslModule {}
