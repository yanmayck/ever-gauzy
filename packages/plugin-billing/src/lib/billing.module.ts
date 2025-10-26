import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Subscription } from './subscription.entity';
import { Plan } from './plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Plan])],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}