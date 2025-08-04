import { MutableEntity } from 'src/core/common_models/mutable.entity';
import * as bcrypt from 'bcrypt';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/enums/role.enum';

@JsonObject()
export class UserEntity extends MutableEntity {
  private static readonly salt = 10;

  @JsonProperty('username')
  private username: string;

  @JsonProperty('password')
  @Exclude()
  private password: string;

  @JsonProperty({ type: () => [Role], name: 'roles' })
  private roles: Role[];

  private isAdmin: boolean;
  constructor(params: {
    id: string;
    createdAtUtc: Date;
    updatedAtUtc: Date;
    username: string;
    pass: string;
    roles: Role[];
    isAdmin?: boolean;
  }) {
    super(params);
    if (!params) return;
    this.username = params.username;
    this.password = params.pass;
    this.roles = params.roles;
    this.isAdmin = params.isAdmin;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getRoles(): Role[] {
    return this.roles;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  isPasswordValid(raw: string): boolean {
    return this.password === raw;
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, UserEntity.salt);
  }
}
