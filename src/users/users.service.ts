import { Injectable } from '@nestjs/common';
import { JsonSerializer } from 'typescript-json-serializer';
import { UserEntity } from './entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private serializer = new JsonSerializer();
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      isAdmin: true,
      roles: [Role.ADMIN],
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  findOne(username: string) {
    const user = this.users.find((user) => user.username === username);
    if (!user) return null;
    return this.serializer.deserializeObject(user, UserEntity);
  }
}
