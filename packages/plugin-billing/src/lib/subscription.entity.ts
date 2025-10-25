export enum SubscriptionStatusEnum {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired'
}

export interface ISubscription {
  id?: string;
  tenantId?: string;
  organizationId?: string;
  status: SubscriptionStatusEnum;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  endedAt?: Date;
  cancelReason?: string;
  metadata?: string;
}

export class Subscription implements ISubscription {
  id?: string;
  tenantId?: string;
  organizationId?: string;
  status: SubscriptionStatusEnum;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  endedAt?: Date;
  cancelReason?: string;
  metadata?: string;

  constructor(data: Partial<ISubscription> = {}) {
    Object.assign(this, data);
  }
}