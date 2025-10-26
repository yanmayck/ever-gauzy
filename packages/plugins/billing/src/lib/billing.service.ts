import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatusEnum } from './subscription.entity';
import { Plan, PlanTypeEnum } from './plan.entity';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
      typescript: true
    });
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.client_reference_id;
        const stripeSubscriptionId = session.subscription.toString();

        const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);

        const newSubscription = new Subscription({
          tenantId,
          stripeSubscriptionId,
          stripeCustomerId: subscription.customer.toString(),
          status: subscription.status as SubscriptionStatusEnum,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });

        await this.subscriptionRepository.save(newSubscription);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const subscription = await this.subscriptionRepository.findOneBy({ stripeSubscriptionId: stripeSubscription.id });

        if (subscription) {
          subscription.status = stripeSubscription.status as SubscriptionStatusEnum;
          subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
          subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
          await this.subscriptionRepository.save(subscription);
        }
        break;
      }
    }

    return { received: true };
  }

  /**
   * Criar sessão de checkout do Stripe
   */
  async createCheckoutSession(input: {
    tenantId: string;
    priceId: string;
    customerEmail?: string;
  }) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: input.customerEmail,
        client_reference_id: input.tenantId,
        success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:4200/subscription/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:4200/subscription/canceled',
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id
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
    const subscription = await this.subscriptionRepository.findOneBy({ tenantId });

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        requiresPayment: true
      };
    }

    const hasActiveSubscription = subscription.status === SubscriptionStatusEnum.ACTIVE || subscription.status === SubscriptionStatusEnum.TRIAL;

    return {
      hasActiveSubscription,
      subscription,
      requiresPayment: !hasActiveSubscription
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

  /**
   * Cria uma assinatura de teste para um novo tenant
   */
  async createTrialSubscription(tenantId: string): Promise<Subscription> {
    const trialDays = parseInt(process.env.TRIAL_DAYS || '7', 10);
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    const newSubscription = new Subscription({
      tenantId,
      status: SubscriptionStatusEnum.TRIAL,
      trialEnd: trialEnd,
      currentPeriodEnd: trialEnd
    });

    return this.subscriptionRepository.save(newSubscription);
  }
}