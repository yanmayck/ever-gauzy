import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Plan } from './billing.types';

@Component({
  selector: 'ga-plan-selection',
  template: `
    <div class="plan-selection-container">
      <h2>Escolha seu Plano</h2>
      <div class="plans-grid">
        <div
          *ngFor="let plan of plans"
          class="plan-card"
          [class.recommended]="plan.name === 'Plano Pro'"
        >
          <h3>{{ plan.name }}</h3>
          <div class="price">
            <span class="amount">R$ {{ plan.amount }}</span>
            <span class="period">/mês</span>
          </div>
          <ul class="features">
            <li *ngFor="let feature of plan.features">
              {{ getFeatureName(feature) }}
            </li>
          </ul>
          <button
            class="select-plan-btn"
            [disabled]="loading"
            (click)="selectPlan(plan)"
          >
            {{ loading ? 'Processando...' : 'Selecionar Plano' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plan-selection-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .plan-card {
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .plan-card.recommended {
      border-color: #007bff;
      transform: scale(1.05);
    }

    .plan-card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .price {
      margin: 20px 0;
    }

    .amount {
      font-size: 2.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .period {
      color: #666;
      margin-left: 5px;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }

    .features li {
      padding: 5px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .select-plan-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      width: 100%;
      transition: background 0.3s ease;
    }

    .select-plan-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .select-plan-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class PlanSelectionComponent implements OnInit {
  plans: Plan[] = [];
  loading = false;
  planForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.planForm = this.fb.group({
      selectedPlan: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPlans();
  }

  async loadPlans() {
    try {
      // TODO: Chamar API para obter planos
      const response = await fetch('/api/billing/plans');
      this.plans = await response.json();
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      // Fallback com planos mock
      this.plans = [
        {
          name: 'Plano Básico',
          type: 'monthly' as any,
          stripePriceId: 'price_basic_monthly',
          amount: 29,
          currency: 'brl',
          maxOrganizations: 1,
          maxUsers: 5,
          features: ['time_tracking', 'projects', 'basic_support']
        },
        {
          name: 'Plano Pro',
          type: 'monthly' as any,
          stripePriceId: 'price_pro_monthly',
          amount: 79,
          currency: 'brl',
          maxOrganizations: 10,
          maxUsers: 50,
          features: ['all_basic', 'reports', 'invoicing', 'priority_support']
        },
        {
          name: 'Plano Enterprise',
          type: 'monthly' as any,
          stripePriceId: 'price_enterprise_monthly',
          amount: 199,
          currency: 'brl',
          maxOrganizations: 100,
          maxUsers: 500,
          features: ['all_features', 'unlimited', 'white_label', 'phone_support']
        }
      ];
    }
  }

  getFeatureName(feature: string): string {
    const featureNames: { [key: string]: string } = {
      'time_tracking': '⏱️ Controle de Tempo',
      'projects': '📁 Gerenciamento de Projetos',
      'basic_support': '💬 Suporte Básico',
      'reports': '📊 Relatórios Avançados',
      'invoicing': '🧾 Faturamento',
      'priority_support': '🚀 Suporte Prioritário',
      'all_features': '⭐ Todos os Recursos',
      'unlimited': '♾️ Ilimitado',
      'white_label': '🏷️ Marca Personalizada',
      'phone_support': '📞 Suporte por Telefone'
    };
    return featureNames[feature] || feature;
  }

  async selectPlan(plan: Plan) {
    this.loading = true;
    try {
      // TODO: Chamar API para criar sessão de checkout
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: this.getCurrentTenantId(),
          priceId: plan.stripePriceId,
          customerEmail: this.getCurrentUserEmail()
        })
      });

      const { checkoutUrl } = await response.json();

      // Redirecionar para Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Erro ao selecionar plano:', error);
      alert('Erro ao processar seleção de plano. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  private getCurrentTenantId(): string {
    // TODO: Obter tenantId do store/auth service
    return 'current-tenant-id';
  }

  private getCurrentUserEmail(): string {
    // TODO: Obter email do usuário logado
    return 'user@example.com';
  }
}