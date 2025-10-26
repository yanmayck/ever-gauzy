import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum SubscriptionStatusEnum {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired'
}

@Entity('subscription')
export class Subscription {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @Column()
  tenantId?: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ type: 'enum', enum: SubscriptionStatusEnum })
  status: SubscriptionStatusEnum;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  planId?: string;

  @Column({ nullable: true })
  planName?: string;

  @Column({ type: 'decimal', nullable: true })
  amount?: number;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd?: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEnd?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  canceledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancelReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: string;

  constructor(data: Partial<Subscription> = {}) {
    Object.assign(this, data);
  }
}