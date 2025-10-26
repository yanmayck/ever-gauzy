export enum SubscriptionStatusEnum {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired'
}

export enum PlanTypeEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
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

export interface IPlan {
  id?: string;
  name: string;
  description?: string;
  type: PlanTypeEnum;
  stripePriceId: string;
  amount: number;
  currency: string;
  maxOrganizations?: number;
  maxUsers?: number;
  features?: string[];
  isActive?: boolean;
  trialDays?: number;
  metadata?: string;
}

export class Plan implements IPlan {
  id?: string;
  name: string;
  description?: string;
  type: PlanTypeEnum;
  stripePriceId: string;
  amount: number;
  currency: string;
  maxOrganizations?: number;
  maxUsers?: number;
  features?: string[];
  isActive?: boolean;
  trialDays?: number;
  metadata?: string;

  constructor(data: Partial<IPlan> = {}) {
    Object.assign(this, data);
  }
}

export interface ICreateCheckoutSessionInput {
  tenantId: string;
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
}

export interface ICreateCustomerPortalInput {
  customerId: string;
  returnUrl?: string;
}

export interface ISubscriptionCheck {
  tenantId: string;
  organizationId?: string;
  requiredFeatures?: string[];
}