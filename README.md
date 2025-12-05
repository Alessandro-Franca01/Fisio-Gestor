<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FisioGestor

Sistema de gestão para fisioterapeutas desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Executar Localmente

**Pré-requisitos:** Node.js 18+ instalado

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave da API Gemini:
     ```
     GEMINI_API_KEY=sua_chave_api_aqui
     ```

3. Executar em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acessar a aplicação:
   - Abra seu navegador em `http://localhost:3000`

## 📦 Build para Produção

### 1. Preparar o Build

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Criar arquivo .env.production com suas variáveis de ambiente
# GEMINI_API_KEY=sua_chave_api_aqui

# Gerar build de produção
npm run build
```

O build será gerado na pasta `dist/` com os arquivos otimizados e minificados.

### 2. Testar o Build Localmente

Antes de fazer deploy, você pode testar o build localmente:

```bash
npm run preview
```

Isso iniciará um servidor local servindo os arquivos de produção.

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)

1. **Instalar Vercel CLI** (opcional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```

3. **Deploy via Dashboard**:
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub/GitLab
   - Configure as variáveis de ambiente:
     - `GEMINI_API_KEY`: sua chave da API
   - Clique em "Deploy"

**Configurações do Vite para Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Opção 2: Netlify

1. **Instalar Netlify CLI** (opcional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```

3. **Deploy via Dashboard**:
   - Acesse [netlify.com](https://netlify.com)
   - Conecte seu repositório
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Adicione variáveis de ambiente no painel

### Opção 3: GitHub Pages

1. **Instalar gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Adicionar script no package.json**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Configurar base no vite.config.ts**:
   ```typescript
   base: '/nome-do-repositorio/'
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### Opção 4: Servidor Próprio (Nginx/Apache)

1. **Gerar build**:
   ```bash
   npm run build
   ```

2. **Upload da pasta `dist/`**:
   - Faça upload de todo o conteúdo da pasta `dist/` para seu servidor
   - Configure seu servidor web para servir os arquivos estáticos

3. **Configuração Nginx** (exemplo):
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       root /caminho/para/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## ⚙️ Variáveis de Ambiente

Crie arquivos `.env` conforme necessário:

- `.env.local` - Desenvolvimento local (não commitado)
- `.env.production` - Produção (não commitado)

**Variáveis disponíveis:**
- `GEMINI_API_KEY` - Chave da API Gemini

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção localmente

## 🔒 Segurança

- ⚠️ **NUNCA** commite arquivos `.env` ou `.env.local` no Git
- Use variáveis de ambiente do seu provedor de hosting para produção
- Mantenha suas chaves de API seguras e rotacione-as regularmente

## 📚 Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
