import { BillingService } from './billing.service';
import { Plan } from './billing.types';

export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /**
   * Obter planos disponíveis
   */
  async getPlans(): Promise<Plan[]> {
    return this.billingService.getAvailablePlans();
  }

  /**
   * Criar sessão de checkout
   */
  async createCheckoutSession(body: {
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
  async getSubscriptionStatus(tenantId: string) {
    return this.billingService.checkSubscription(tenantId);
  }
}