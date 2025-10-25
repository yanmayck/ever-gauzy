// Exemplo de como integrar o billing com o fluxo de cadastro do Gauzy

/**
 * FLUXO DE INTEGRAÇÃO:
 *
 * 1. Usuário preenche formulário de cadastro
 * 2. Sistema cria tenant/organization TEMPORÁRIA
 * 3. Redireciona para seleção de plano
 * 4. Após pagamento, ativa tenant/organization
 * 5. Libera acesso completo
 */

// Exemplo de modificação no auth.service.ts
export class AuthService {
  async register(userData: any, selectedPlan?: string) {
    // 1. Criar usuário e tenant temporário
    const result = await this.createTemporaryTenant(userData);

    if (selectedPlan) {
      // 2. Se plano selecionado, criar sessão de checkout
      const checkoutResult = await this.billingService.createCheckoutSession({
        tenantId: result.tenantId,
        priceId: selectedPlan,
        customerEmail: userData.email
      });

      return {
        requiresPayment: true,
        checkoutUrl: checkoutResult.checkoutUrl,
        tenantId: result.tenantId
      };
    }

    return {
      requiresPayment: true,
      tenantId: result.tenantId
    };
  }

  async completeRegistration(sessionId: string) {
    // 1. Verificar pagamento no Stripe
    const session = await this.stripeService.retrieveSession(sessionId);

    if (session.payment_status === 'paid') {
      // 2. Ativar tenant/organization
      await this.activateTenant(session.metadata.tenantId);

      // 3. Gerar token de acesso
      const token = await this.generateAccessToken(session.metadata.tenantId);

      return {
        success: true,
        token: token,
        redirectUrl: '/dashboard'
      };
    }

    return {
      success: false,
      error: 'Pagamento não confirmado'
    };
  }
}

// Exemplo de guard para verificar subscription
export class SubscriptionGuard {
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['tenant-id'];

    if (!tenantId) {
      return false;
    }

    const subscriptionCheck = await this.billingService.checkSubscription(tenantId);

    if (!subscriptionCheck.hasActiveSubscription) {
      // Redirecionar para página de pagamento
      const response = context.switchToHttp().getResponse();
      response.redirect('/subscription-required');
      return false;
    }

    return true;
  }
}

// Exemplo de como usar no app.module.ts
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de billing em rotas protegidas
    consumer
      .apply(BillingMiddleware)
      .forRoutes(
        { path: 'projects', method: RequestMethod.ALL },
        { path: 'employees', method: RequestMethod.ALL },
        { path: 'invoices', method: RequestMethod.ALL }
      );
  }
}