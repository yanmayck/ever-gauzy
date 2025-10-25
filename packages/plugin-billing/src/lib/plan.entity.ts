export enum PlanTypeEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
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