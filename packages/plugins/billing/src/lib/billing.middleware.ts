import { BillingService } from './billing.service';

export class BillingMiddleware {
  constructor(private readonly billingService: BillingService) {}

  async use(req: any, res: any, next: any) {
    // Extrair tenantId do header
    const tenantId = req.headers['tenant-id'];

    if (!tenantId) {
      return next();
    }

    try {
      // Verificar subscription
      const subscriptionCheck = await this.billingService.checkSubscription(tenantId);

      if (!subscriptionCheck.hasActiveSubscription && subscriptionCheck.requiresPayment) {
        // Redirecionar para página de subscription se necessário
        if (req.headers.accept?.includes('text/html')) {
          return res.redirect('/subscription-required');
        } else {
          return res.status(402).json({
            error: 'Subscription required',
            message: 'Active subscription required to access this resource',
            redirectUrl: '/subscription'
          });
        }
      }

      // Adicionar subscription info na request
      req.subscription = subscriptionCheck.subscription;
      next();
    } catch (error) {
      console.error('Billing middleware error:', error);
      next();
    }
  }
}