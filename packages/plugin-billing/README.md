# Plugin de Billing para Gauzy

Este plugin adiciona funcionalidades completas de subscription e billing ao Gauzy, permitindo que você venda o sistema como SaaS com diferentes planos pagos.

## 🚀 Funcionalidades

- ✅ **Múltiplos Planos**: Básico, Pro, Enterprise com diferentes limites
- ✅ **Integração Stripe**: Pagamentos seguros e recorrentes
- ✅ **Controle de Acesso**: Features liberadas por plano
- ✅ **Middleware de Verificação**: Bloqueia acesso sem assinatura
- ✅ **Webhooks**: Processamento automático de pagamentos
- ✅ **Portal do Cliente**: Gerenciamento de assinaturas
- ✅ **Multi-tenant**: Isolamento por tenant/organização

## 📋 Pré-requisitos

1. **Conta Stripe** ativa em modo produção
2. **Produtos configurados** no Stripe Dashboard
3. **Chaves da API** do Stripe
4. **Domínio próprio** para webhooks

## ⚙️ Configuração

### 1. Variáveis de Ambiente (.env.compose)

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_live_seu_publishable_key_aqui
STRIPE_SECRET_KEY=sk_live_seu_secret_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# Payment Plans (IDs do Stripe)
PLAN_BASIC_PRICE_ID=price_basic_monthly
PLAN_PRO_PRICE_ID=price_pro_monthly
PLAN_ENTERPRISE_PRICE_ID=price_enterprise_monthly

# Subscription Limits
BASIC_PLAN_MAX_ORGANIZATIONS=1
BASIC_PLAN_MAX_USERS=5
PRO_PLAN_MAX_ORGANIZATIONS=10
PRO_PLAN_MAX_USERS=50
ENTERPRISE_PLAN_MAX_ORGANIZATIONS=100
ENTERPRISE_PLAN_MAX_USERS=500

# Subscription Enforcement
REQUIRE_SUBSCRIPTION=true
ENFORCE_SUBSCRIPTION_ON_LOGIN=true
ENFORCE_SUBSCRIPTION_ON_API_CALLS=true
REDIRECT_TO_SUBSCRIPTION_PAGE=true
SUBSCRIPTION_PAGE_URL=https://your-domain.com/subscription
```

### 2. Configurar Produtos no Stripe

1. **Acesse**: [Stripe Dashboard](https://dashboard.stripe.com)
2. **Products** → **Add Product**
3. **Crie 3 produtos**:
   - **Plano Básico**: R$ 29/mês
   - **Plano Pro**: R$ 79/mês
   - **Plano Enterprise**: R$ 199/mês

4. **Obtenha os Price IDs** de cada produto

### 3. Configurar Webhook

1. **Endpoints** → **Add Endpoint**
2. **URL**: `https://your-domain.com/api/billing/webhook`
3. **Eventos**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 🔧 Instalação

### 1. Adicionar ao plugins.ts

```typescript
// apps/api/src/plugins.ts
import { BillingPlugin } from '@gauzy/plugin-billing';

export const plugins = [
  // ... outros plugins
  BillingPlugin
];
```

### 2. Adicionar Middleware

```typescript
// apps/api/src/main.ts ou app.module.ts
import { BillingMiddleware } from '@gauzy/plugin-billing';

app.use('/api/*', BillingMiddleware);
```

### 3. Frontend Integration

```typescript
// apps/gauzy/src/app/app.module.ts
import { PlanSelectionComponent } from '@gauzy/plugin-billing';

@NgModule({
  declarations: [
    // ... outros components
    PlanSelectionComponent
  ]
})
export class AppModule {}
```

## 📱 Fluxo de Uso

### Para Novos Usuários:

1. **Cadastro**: Usuário preenche dados básicos
2. **Escolha de Plano**: Seleciona entre Básico/Pro/Enterprise
3. **Pagamento**: Redirecionado para Stripe Checkout
4. **Ativação**: Após pagamento, conta é ativada
5. **Acesso**: Libera funcionalidades do plano escolhido

### Para Usuários Existentes:

1. **Portal do Cliente**: Gerenciar assinatura via Stripe
2. **Upgrade/Downgrade**: Alterar plano a qualquer momento
3. **Cancelamento**: Suspensão automática do acesso

## 🎯 Personalização

### Limitar Features por Plano:

```typescript
// Em components
canAccess(feature: string): boolean {
  return this.userPlan.features.includes(feature);
}

// Exemplo de uso
if (this.canAccess('invoicing')) {
  // Mostra módulo de faturamento
}
```

### Páginas Customizadas:

```typescript
// Roteamento personalizado
{
  path: 'subscription',
  component: PlanSelectionComponent
},
{
  path: 'subscription-required',
  component: SubscriptionRequiredComponent
}
```

## 🔒 Segurança

- **Webhooks Verificados**: Assinatura Stripe validada
- **Rate Limiting**: Limita tentativas de pagamento
- **CORS**: Configurado para seu domínio
- **HTTPS Obrigatório**: Para produção

## 🚀 Deploy

### 1. Build do Plugin:
```bash
cd packages/plugin-billing
npm run build
```

### 2. Deploy com Docker:
```bash
docker-compose up -d
```

### 3. Testar Webhook:
```bash
stripe listen --forward-to https://your-domain.com/api/billing/webhook
```

## 💡 Dicas

1. **Teste Primeiro**: Use chaves de teste do Stripe
2. **Monitore**: Acompanhe logs de webhooks
3. **Backup**: Tenha plano B se Stripe falhar
4. **Suporte**: Ofereça trials curtos (3-7 dias)
5. **Analytics**: Integre com PostHog para métricas

## 🔧 Troubleshooting

### Erro: "NOAUTH Authentication required"
- Configure senha do Redis no .env.compose
- Reinicie containers: `docker-compose down && docker-compose up -d`

### Erro: "Webhook signature verification failed"
- Verifique STRIPE_WEBHOOK_SECRET
- Use `stripe listen` para testar localmente

### Erro: "Subscription required"
- Verifique se tenant tem subscription ativa
- Configure REQUIRE_SUBSCRIPTION=false para testes

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique logs: `docker-compose logs api`
2. Teste webhooks: `stripe trigger customer.subscription.created`
3. Monitore Stripe Dashboard

---

**Plugin criado para permitir monetização do Gauzy como SaaS com controle total de assinaturas e pagamentos.**