import { Controller, Post, Body, Headers, Get, Param } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Plan } from './plan.entity';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('webhook')
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.billingService.handleWebhook(rawBody, signature);
  }

  /**
   * Obter planos disponíveis
   */
  @Get('plans')
  async getPlans(): Promise<Plan[]> {
    return this.billingService.getAvailablePlans();
  }

  /**
   * Criar sessão de checkout
   */
  @Post('checkout')
  async createCheckoutSession(@Body() body: {
    tenantId: string;
    priceId: string;
    customerEmail?: string;
  }) {
    return this.billingService.createCheckoutSession({
      tenantId: body.tenantId,
      priceId: body.priceId,
      customerEmail: body.customerEmail,
    });
  }

  /**
   * Verificar status da subscription
   */
  @Get('status/:tenantId')
  async getSubscriptionStatus(@Param('tenantId') tenantId: string) {
    return this.billingService.checkSubscription(tenantId);
  }
}