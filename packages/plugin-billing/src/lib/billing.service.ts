import { Subscription, Plan, SubscriptionStatusEnum, PlanTypeEnum } from './billing.types';

export class BillingService {

  /**
   * Criar sessão de checkout do Stripe
   */
  async createCheckoutSession(input: {
    tenantId: string;
    priceId: string;
    customerEmail?: string;
    successUrl?: string;
    cancelUrl?: string;
  }) {
    try {
      // Simular URL de checkout do Stripe
      const checkoutUrl = `https://buy.stripe.com/test_${input.priceId}?client_reference_id=${input.tenantId}`;

      return {
        checkoutUrl: checkoutUrl,
        sessionId: 'test_session_id'
      };
    } catch (error) {
      throw new Error(`Erro ao criar sessão de checkout: ${error.message}`);
    }
  }

  /**
   * Verificar se tenant tem subscription ativa
   */
  async checkSubscription(tenantId: string): Promise<{
    hasActiveSubscription: boolean;
    subscription?: Subscription;
    requiresPayment: boolean;
  }> {
    // TODO: Implementar consulta no banco de dados
    return {
      hasActiveSubscription: false,
      requiresPayment: true
    };
  }

  /**
   * Obter planos disponíveis
   */
  async getAvailablePlans(): Promise<Plan[]> {
    return [
      new Plan({
        name: 'Plano Básico',
        type: PlanTypeEnum.MONTHLY,
        stripePriceId: 'price_basic_monthly',
        amount: 29,
        currency: 'brl',
        maxOrganizations: 1,
        maxUsers: 5,
        features: ['time_tracking', 'projects', 'basic_support']
      }),
      new Plan({
        name: 'Plano Pro',
        type: PlanTypeEnum.MONTHLY,
        stripePriceId: 'price_pro_monthly',
        amount: 79,
        currency: 'brl',
        maxOrganizations: 10,
        maxUsers: 50,
        features: ['all_basic', 'reports', 'invoicing', 'priority_support']
      }),
      new Plan({
        name: 'Plano Enterprise',
        type: PlanTypeEnum.MONTHLY,
        stripePriceId: 'price_enterprise_monthly',
        amount: 199,
        currency: 'brl',
        maxOrganizations: 100,
        maxUsers: 500,
        features: ['all_features', 'unlimited', 'white_label', 'phone_support']
      })
    ];
  }
}