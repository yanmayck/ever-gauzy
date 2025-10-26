import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum PlanTypeEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
}

@Entity('plan')
export class Plan {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: PlanTypeEnum })
  type: PlanTypeEnum;

  @Index()
  @Column()
  stripePriceId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  maxOrganizations?: number;

  @Column({ nullable: true })
  maxUsers?: number;

  @Column('simple-array', { nullable: true })
  features?: string[];

  @Column({ default: true })
  isActive?: boolean;

  @Column({ nullable: true })
  trialDays?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: string;

  constructor(data: Partial<Plan> = {}) {
    Object.assign(this, data);
  }
}