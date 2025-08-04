import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { ImmutableEntity } from './immutable.entity';

@JsonObject()
export class MutableEntity extends ImmutableEntity {
  @JsonProperty('updatedAtUtc')
  public updatedAtUtc: Date;

  constructor(params: { id?: string; createdAtUtc?: Date; updatedAtUtc?: Date }) {
    super(params);
    if (!params) return;
    this.setUpdatedAtUtc(params?.updatedAtUtc);
  }

  public setUpdatedAtUtc(updatedAt: Date): void {
    this.updatedAtUtc = updatedAt ?? new Date();
  }
  public update() {
    this.setUpdatedAtUtc(new Date());
  }
}
