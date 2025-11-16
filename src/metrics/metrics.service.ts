import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  readonly httpRequestsTotal: Counter<string>;
  readonly httpRequestsDurationSeconds: Histogram<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'HTTP requests count',
      labelNames: ['method', 'route', 'code'],
      registers: [this.registry],
    });
    this.httpRequestsDurationSeconds = new Histogram({
      name: 'http_requests_duration_seconds',
      help: 'HTTP requests duration in seconds',
      labelNames: ['method', 'route', 'code'],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  get ContentType(): string {
    return this.registry.contentType;
  }
}
