import { JsonObject, JsonProperty } from 'typescript-json-serializer';

@JsonObject()
export abstract class ImmutableEntity {
  @JsonProperty('id')
  public id: string;

  @JsonProperty('createdAtUtc')
  public createdAtUtc: Date;

  constructor(params: { id?: string; createdAtUtc?: Date }) {
    if (!params) return;
    this.setId(params?.id);
    this.setCreatedAt(params?.createdAtUtc);
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAtUtc;
  }

  public setId(id: string): void {
    this.id = id ?? crypto.randomUUID();
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAtUtc = createdAt ?? new Date();
  }
}
