import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

export class BillingModule {
  static providers = [BillingService];
  static controllers = [BillingController];
}