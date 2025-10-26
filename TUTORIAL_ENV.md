# Guia Completo de Variáveis de Ambiente (.env) para Gauzy

Este documento serve como uma referência completa para todas as variáveis de ambiente usadas na plataforma Gauzy. Use-o para configurar seu ambiente de desenvolvimento (`.env.local` ou `.env`) ou de produção.

---

## 1. Configurações Gerais da Aplicação

Configurações básicas que definem a identidade, URLs e comportamento geral da sua instância Gauzy.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `APP_NAME` | O nome da sua aplicação. Aparece em títulos, e-mails, etc. | `APP_NAME="Minha Empresa"` |
| `APP_LOGO` | URL completa para o logo da sua aplicação. | `APP_LOGO="https://site.com/logo.png"` |
| `APP_SIGNATURE` | Uma assinatura ou tagline curta usada em e-mails. | `APP_SIGNATURE="Sua Plataforma de Gestão"` |
| `APP_LINK` | O link principal para a sua aplicação (geralmente o front-end). | `APP_LINK="https://app.meudominio.com"` |
| `API_BASE_URL` | **(CRÍTICO)** A URL base completa para a sua API (back-end). | `API_BASE_URL="https://api.meudominio.com"` |
| `CLIENT_BASE_URL` | **(CRÍTICO)** A URL base completa para sua aplicação cliente (front-end). | `CLIENT_BASE_URL="https://app.meudominio.com"` |
| `NODE_ENV` | Define o ambiente da aplicação. | `development` ou `production` |
| `IS_DOCKER` | Defina como `true` se estiver rodando a aplicação dentro de um contêiner Docker. | `IS_DOCKER=true` |
| `DEMO` | Ativa o modo de demonstração, que pode incluir credenciais padrão e outras facilidades. | `DEMO=false` |
| `ALLOW_SUPER_ADMIN_ROLE` | Permite ou não a existência da função de Super Administrador. | `ALLOW_SUPER_ADMIN_ROLE=true` |
| `DEFAULT_CURRENCY` | A moeda padrão para toda a aplicação (formato ISO 4217). | `DEFAULT_CURRENCY=BRL` |
| `DEFAULT_COUNTRY` | O país padrão (formato ISO 3166-1 alpha-2). | `DEFAULT_COUNTRY=BR` |

---

## 2. Configurações do Banco de Dados

Configure a conexão com seu banco de dados principal.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_TYPE` | O tipo de banco de dados. `postgres` é recomendado para produção. | `DB_TYPE=postgres` |
| `DB_HOST` | O endereço do servidor do banco de dados. | `DB_HOST=localhost` |
| `DB_PORT` | A porta do servidor do banco de dados. | `DB_PORT=5432` |
| `DB_NAME` | O nome do banco de dados. | `DB_NAME=gauzy_prod` |
| `DB_USER` | O nome de usuário para a conexão. | `DB_USER=postgres` |
| `DB_PASS` | A senha para o usuário do banco de dados. | `DB_PASS="senha_forte"` |
| `DB_LOGGING` | Ativa o log de todas as queries SQL executadas. Útil para debug. | `DB_LOGGING=all` |
| `DB_SYNCHRONIZE` | **(NÃO USE EM PRODUÇÃO)** Se `true`, sincroniza automaticamente o schema do banco de dados com as entidades. Pode causar perda de dados. | `DB_SYNCHRONIZE=false` |
| `DB_SSL_MODE` | Ativa a conexão SSL com o banco de dados. | `DB_SSL_MODE=false` |
| `DB_CA_CERT` | O certificado CA (codificado em base64) se `DB_SSL_MODE` for `true`. | `DB_CA_CERT="MI...=="` |

---

## 3. Configurações do Redis

Usado para cache, sessões e comunicação entre serviços. Altamente recomendado para produção.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `REDIS_ENABLED` | Ativa ou desativa o Redis. Se `false`, um cache em memória será usado. | `REDIS_ENABLED=true` |
| `REDIS_URL` | A URL de conexão completa para o Redis, incluindo senha se houver. | `REDIS_URL=redis://:senha@host:6379` |

---

## 4. Autenticação e Segurança (JWT)

Configurações para JSON Web Tokens, usados para gerenciar sessões de usuário de forma segura.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `JWT_SECRET` | **(CRÍTICO)** Chave secreta para assinar tokens de acesso. Use um valor longo e aleatório. | `JWT_SECRET="valor_aleatorio_muito_longo"` |
| `JWT_TOKEN_EXPIRATION_TIME` | Tempo de vida do token de acesso, em segundos. | `86400` (1 dia) |
| `JWT_REFRESH_TOKEN_SECRET` | **(CRÍTICO)** Chave secreta para assinar "refresh tokens". Deve ser diferente do `JWT_SECRET`. | `JWT_REFRESH_TOKEN_SECRET="outro_valor_aleatorio"` |
| `JWT_REFRESH_TOKEN_EXPIRATION_TIME` | Tempo de vida do "refresh token", em segundos. | `604800` (7 dias) |
| `EXPRESS_SESSION_SECRET` | Chave secreta para sessões do Express. | `EXPRESS_SESSION_SECRET="mais_um_segredo"` |
| `THROTTLE_ENABLED` | Ativa a limitação de taxa (Rate Limiting) para proteger contra ataques de força bruta. | `THROTTLE_ENABLED=true` |
| `THROTTLE_TTL` | Tempo em milissegundos que as requisições são lembradas para o Rate Limiting. | `60000` (1 minuto) |
| `THROTTLE_LIMIT` | Número máximo de requisições permitidas dentro da janela de `THROTTLE_TTL`. | `100` |

---

## 5. Faturamento e Assinaturas (Stripe)

Configurações para o plugin de faturamento, se você o estiver usando com o Stripe.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `REQUIRE_SUBSCRIPTION` | Se `true`, força que novos usuários/tenants tenham uma assinatura para usar o sistema. | `REQUIRE_SUBSCRIPTION=true` |
| `TRIAL_DAYS` | Número de dias para o período de teste gratuito. | `TRIAL_DAYS=14` |
| `STRIPE_PUBLISHABLE_KEY` | Chave publicável do Stripe (prefixo `pk_`). | `pk_test_...` ou `pk_live_...` |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe (prefixo `sk_`). **Mantenha em segredo.** | `sk_test_...` ou `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Chave secreta do endpoint do webhook para verificar a autenticidade dos eventos do Stripe (prefixo `whsec_`). | `whsec_...` |
| `STRIPE_SUCCESS_URL` | URL para onde o usuário é redirecionado após um pagamento bem-sucedido. | `https://app.meudominio.com/billing/success` |
| `STRIPE_CANCEL_URL` | URL para onde o usuário é redirecionado se cancelar o pagamento. | `https://app.meudominio.com/billing/cancel` |

---

## 6. Armazenamento de Arquivos

Configure onde os arquivos enviados pelos usuários serão armazenados.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `FILE_PROVIDER` | Define o provedor de armazenamento. | `LOCAL`, `S3`, `WASABI`, `CLOUDINARY` |
| `AWS_ACCESS_KEY_ID` | Chave de acesso da AWS (para `S3`). | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Chave de acesso secreta da AWS (para `S3`). | `...` |
| `AWS_REGION` | Região da AWS onde o bucket S3 está localizado. | `us-east-1` |
| `AWS_S3_BUCKET` | Nome do seu bucket S3. | `meu-bucket-gauzy` |

*Nota: Existem configurações similares para outros provedores como Wasabi, DigitalOcean Spaces e Cloudinary.*

---

## 7. Envio de E-mail (SMTP)

Configuração do serviço para enviar e-mails transacionais.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `MAIL_FROM_ADDRESS` | O endereço de e-mail "De" que aparecerá para os usuários. | `nao-responda@meudominio.com` |
| `MAIL_HOST` | Endereço do seu servidor SMTP. | `smtp.sendgrid.net` |
| `MAIL_PORT` | Porta do servidor SMTP. | `587` |
| `MAIL_USERNAME` | Nome de usuário para autenticação no servidor SMTP. | `apikey` (para SendGrid) |
| `MAIL_PASSWORD` | Senha ou chave de API para autenticação no servidor SMTP. | `SG....` |

---

## 8. Integrações de Terceiros

Chaves e configurações para serviços externos.

### Sentry (Monitoramento de Erros)
| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SENTRY_DSN` | O DSN do seu projeto Sentry para capturar erros no back-end e front-end. | `https://...` |

### PostHog (Análise de Produto)
| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `POSTHOG_KEY` | Chave de API do seu projeto PostHog. | `phc_...` |
| `POSTHOG_HOST` | URL da sua instância PostHog. | `https://app.posthog.com` |
| `POSTHOG_ENABLED` | Ativa ou desativa a integração com o PostHog. | `true` |

### Jitsu (Coleta de Dados)
| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `JITSU_SERVER_URL` | URL do seu servidor Jitsu. | `http://localhost:8000` |
| `JITSU_SERVER_WRITE_KEY` | Chave de escrita (write key) para enviar eventos ao Jitsu. | `...` |

### OAuth (Login Social)
Para cada provedor (Google, Facebook, GitHub, etc.), você precisará de um `CLIENT_ID` e um `CLIENT_SECRET` obtidos ao registrar sua aplicação no respectivo provedor.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | Client ID do seu app OAuth do Google. | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret do seu app OAuth do Google. | `GOCSPX-...` |
| `GITHUB_CLIENT_ID` | Client ID do seu app OAuth do GitHub. | `...` |
| `GITHUB_CLIENT_SECRET` | Client Secret do seu app OAuth do GitHub. | `...` |

---

## 9. Controle de Funcionalidades (Feature Toggles)

Permite ligar ou desligar módulos inteiros da aplicação. Muito útil para customizar a experiência do usuário.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `FEATURE_TIME_TRACKING` | Ativa/desativa o módulo de acompanhamento de tempo. | `true` |
| `FEATURE_INVOICE` | Ativa/desativa o módulo de faturas. | `true` |
| `FEATURE_EMPLOYEES` | Ativa/desativa o módulo de gerenciamento de funcionários. | `true` |
| `FEATURE_ORGANIZATION` | Ativa/desativa o módulo de gerenciamento da organização (projetos, equipes, etc.). | `true` |
| `FEATURE_REPORTS` | Ativa/desativa o módulo de relatórios. | `true` |

*Nota: Existem dezenas de `FEATURE_` flags. Revise o `.env.sample` para a lista completa e ative apenas o que for necessário para o seu caso de uso.*

---

Este guia deve fornecer uma base sólida para configurar sua aplicação Gauzy. Lembre-se de nunca expor seus arquivos `.env` contendo segredos em repositórios públicos.
