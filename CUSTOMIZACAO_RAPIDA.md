
# Guia de Personalização Visual Rápida para o Projeto Gauzy

Este guia explica como alterar a aparência básica da sua instância do Gauzy (nome, logo e cores) de forma rápida e segura.

## 1. Alterando Nome e Logo (Método Fácil e Recomendado)

A forma mais segura de alterar o nome e o logo é usando variáveis de ambiente. Crie um arquivo chamado `.env.local` na raiz do projeto (`ever-gauzy/.env.local`).

Este arquivo **não** é enviado para o repositório (Git), então suas personalizações são apenas suas.

**Passo a passo:**

1.  Crie o arquivo `ever-gauzy/.env.local`.
2.  Copie e cole o conteúdo abaixo dentro dele.
3.  **Edite os valores** para refletir sua marca.

```env
# ================================================
# ARQUIVO DE PERSONALIZAÇÃO DA SUA MARCA
# Substitua os valores abaixo pelos da sua empresa
# ================================================

# O nome da sua aplicação que aparecerá na interface
APP_NAME="NomeDaSuaPlataforma"

# O URL completo para o logo da sua empresa.
# Este logo deve estar acessível publicamente (ex: https://suaempresa.com/logo.png)
# Você pode usar um serviço como https://imgur.com/ para hospedar seu logo.
APP_LOGO="URL_PARA_SEU_LOGO_AQUI"

# O nome da sua empresa
COMPANY_NAME="Sua Empresa LTDA"

# O link para o site da sua empresa
COMPANY_LINK="https://www.suaempresa.com"

# Logo da plataforma (usado em alguns lugares, como na tela de login)
# Recomenda-se usar um SVG. Você pode substituir o arquivo localmente também.
# Caminho do arquivo original: ever-gauzy/apps/gauzy/src/assets/images/logos/logo_Gauzy.svg
PLATFORM_LOGO="URL_PARA_SEU_LOGO_SVG_AQUI"

```

**Importante:** Após salvar o arquivo `.env.local`, você precisa reiniciar a aplicação (se estiver rodando com `docker-compose`, use `docker-compose down` e `docker-compose up`) para que as alterações tenham efeito.

---

## 2. Alterando as Cores do Tema (Método Avançado)

As cores da interface (botões, fundos, etc.) são controladas por um arquivo de tema SCSS (Sass).

**Atenção:** A alteração deste arquivo requer que você reconstrua o projeto para que as mudanças visuais sejam aplicadas.

**Passo a passo:**

1.  **Localize o arquivo:** O arquivo que controla os temas está em:
    `ever-gauzy/packages/ui-core/static/styles/themes.scss`

2.  **Edite as cores:** Abra o arquivo e procure pela seção que começa com `$nb-themes: nb-register-theme(`. A que mais nos interessa é a do tema `gauzy-light`.

    Abaixo estão as principais variáveis de cor que você pode alterar. A cor primária (`color-primary-500`) é a mais importante para a identidade da sua marca.

    ```scss
    // Exemplo de como as variáveis de cor estão no arquivo
    
    $nb-themes: nb-register-theme(
      (
        // ... outras variáveis ...

        // Status colors: primary, success, info, warning, danger
        color-primary-100: #f2f6ff,       // Cor primária bem clara
        color-primary-200: #dbd3f7,
        color-primary-300: #ab92fd,
        color-primary-400: #7d56fd,
        color-primary-500: #6e49e8,       // << ESTA É A COR PRINCIPAL DA MARCA
        color-primary-600: #5037a3,       // Cor primária mais escura
        color-primary-700: #3d2a7a,
        color-primary-800: #291d52,
        color-primary-900: #1a1038,

        // Cores de status
        color-success-default: rgba(37, 184, 105, 1),
        color-info-default: rgba(0, 136, 254, 1),
        color-danger-default: #ff0000,
        color-warning-default: rgba(255, 171, 45, 1),

        // Cor de fundo principal
        layout-background-color: #ffffff,

        // Cor de fundo dos "cards"
        card-background-color: rgb(249, 249, 249),

        // Fonte principal
        font-family-primary: string.unquote('Inter, sans-serif'),
        
        // ... outras variáveis ...
      ),
      gauzy-light, // nome do tema
      default      // tema base
    );
    ```

3.  **Como alterar:** Substitua os códigos hexadecimais (ex: `#6e49e8`) pelos códigos de cor da sua marca. Você pode usar um site como [Coolors.co](https://coolors.co/) para gerar uma paleta de cores.

4.  **Recompile a Aplicação:** Após salvar as alterações no arquivo `themes.scss`, você precisará parar a aplicação e recompilá-la. Use os comandos de build do projeto, como por exemplo:
    ```bash
    yarn build:gauzy
    ```
    Ou, se estiver usando Docker, talvez precise reconstruir a imagem do `webapp`:
    ```bash
    docker-compose build webapp
    ```

---

### Resumo

-   **Para Nome e Logo:** Crie e edite `ever-gauzy/.env.local`. (Mais fácil)
-   **Para Cores:** Edite `ever-gauzy/packages/ui-core/static/styles/themes.scss` e recompile. (Mais avançado)

Comece pelo método 1, que já dará uma cara nova para sua aplicação com baixo risco.
