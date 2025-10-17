# Guia de Deploy - Dashboard CRM Bruna

**Data:** 16/10/2025
**Status:** Pronto para Deploy
**Domínio:** https://crm.walterzamarian.com.br

---

## Credenciais Configuradas

### Login Admin
- **Email:** drzamarian@gmail.com
- **Senha:** `BrunaCRM2025!Secure`
- **NEXTAUTH_SECRET:** Gerado e configurado
- **Password Hash:** Gerado via bcryptjs

**IMPORTANTE:** Essas credenciais estão configuradas no `.env.local`. Altere a senha em produção!

---

## Passo 1: Testar Localmente (5 min)

### 1.1 Iniciar servidor dev
```bash
cd /Users/walter/projetos/bruna-crm-dashboard
npm run dev
```

### 1.2 Acessar dashboard
Abrir navegador em: http://localhost:3000

### 1.3 Fazer login
- Email: `drzamarian@gmail.com`
- Senha: `BrunaCRM2025!Secure`

### 1.4 Testar navegação
- Overview (métricas)
- Pacientes
- Calendário
- Logout

**NOTA:** As APIs vão falhar porque `CRM_API_URL` ainda não está configurada com Lambda real.

---

## Passo 2: Obter Lambda CRM API URL (PENDENTE)

### 2.1 Verificar se Lambda bruna-crm-crm-api existe
```bash
aws lambda get-function --function-name bruna-crm-crm-api --region us-east-1 --query 'Configuration.FunctionArn' --output text
```

### 2.2 Criar Function URL (se não existe)
```bash
aws lambda create-function-url-config \
  --function-name bruna-crm-crm-api \
  --auth-type NONE \
  --region us-east-1 \
  --query 'FunctionUrl' \
  --output text
```

### 2.3 Adicionar permissão pública
```bash
aws lambda add-permission \
  --function-name bruna-crm-crm-api \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region us-east-1
```

### 2.4 Atualizar .env.local
Copiar a URL retornada e atualizar:
```env
CRM_API_URL=https://XXXXXXXX.lambda-url.us-east-1.on.aws
```

**Remover `/prod` do final - Lambda Function URLs não usam stage**

---

## Passo 3: Deploy Vercel (10 min)

### 3.1 Push para GitHub (se ainda não foi)
```bash
# Criar repositório no GitHub primeiro: bruna-crm-dashboard

git init
git add .
git commit -m "Dashboard CRM completo - Deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/bruna-crm-dashboard.git
git push -u origin main
```

### 3.2 Deploy na Vercel
1. Acesse https://vercel.com/new
2. Importe repositório `bruna-crm-dashboard`
3. Configure framework: **Next.js**
4. Root Directory: **/** (raiz)
5. Build Command: `npm run build` (padrão)
6. Output Directory: `.next` (padrão)

### 3.3 Configurar Environment Variables
Na aba "Environment Variables", adicione:

| Nome | Valor | Tipo |
|------|-------|------|
| `NEXTAUTH_URL` | `https://crm.walterzamarian.com.br` | Production |
| `NEXTAUTH_SECRET` | `aT0omadfWqRv1hJN0F1suOTBGP3GWr3KROyQOvlrGUQ=` | All Environments |
| `ADMIN_EMAIL` | `drzamarian@gmail.com` | All Environments |
| `ADMIN_PASSWORD_HASH` | `$2b$10$39Os7QLZaXJdYV4PuTPpw.SU65pqUjvjQRSvLwMc3cz6zLCuYOz6O` | All Environments |
| `CRM_API_URL` | `https://LAMBDA-URL.lambda-url.us-east-1.on.aws` | All Environments |

**IMPORTANTE:** Substitua `LAMBDA-URL` pela URL real da Lambda (Passo 2)

### 3.4 Deploy
Clique em **Deploy** e aguarde build (~2-3 minutos)

---

## Passo 4: Configurar Domínio Custom (5 min)

### 4.1 Adicionar domínio na Vercel
1. Projeto > Settings > Domains
2. Adicionar: `crm.walterzamarian.com.br`
3. Vercel mostrará registros DNS necessários

### 4.2 Configurar DNS (Route53 ou provedor do domínio)

**Opção A - CNAME (Recomendado):**
```
Type: CNAME
Name: crm.walterzamarian.com.br
Value: cname.vercel-dns.com
TTL: 300
```

**Opção B - A Record:**
```
Type: A
Name: crm.walterzamarian.com.br
Value: 76.76.21.21
TTL: 300
```

### 4.3 Aguardar propagação DNS (5-30 min)
Verificar com:
```bash
dig crm.walterzamarian.com.br
```

---

## Passo 5: Validação Pós-Deploy (5 min)

### 5.1 Acessar dashboard em produção
https://crm.walterzamarian.com.br

### 5.2 Testar login
- Email: `drzamarian@gmail.com`
- Senha: `BrunaCRM2025!Secure`

### 5.3 Verificar páginas
- [ ] Overview carrega métricas
- [ ] Pacientes carrega tabela
- [ ] Calendário carrega consultas
- [ ] NavBar funciona
- [ ] Logout redireciona para login

### 5.4 Verificar logs de erro (se houver)
Vercel > Projeto > Logs > Functions

---

## Estrutura do Projeto

```
bruna-crm-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/login/              # Página de login
│   │   ├── (dashboard)/               # Dashboard protegido
│   │   │   ├── layout.tsx             # Layout com NavBar
│   │   │   ├── page.tsx               # Overview
│   │   │   ├── pacientes/
│   │   │   ├── calendario/
│   │   │   ├── metricas/
│   │   │   └── config/
│   │   └── api/
│   │       ├── auth/[...nextauth]/    # NextAuth endpoints
│   │       └── proxy/                 # Proxy para Lambda
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   └── dashboard/                 # Dashboard components
│   ├── lib/
│   │   ├── api.ts                     # API client
│   │   ├── auth.ts                    # NextAuth config
│   │   └── utils.ts                   # Utilities
│   └── types/
│       └── index.ts                   # TypeScript types
├── .env.local                         # Variáveis locais (NÃO COMMITTAR)
├── .env.local.example                 # Template de variáveis
├── DEPLOY-GUIDE.md                    # Este arquivo
├── DASHBOARD-SPECS.md                 # Especificações completas
├── STATUS.md                          # Status de implementação
└── RESUMO-SESSAO.md                   # Resumo da sessão
```

---

## Arquitetura

```
┌─────────────────┐
│   Navegador     │
│  (crm.walter..  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel CDN     │
│   Next.js 14    │
└────────┬────────┘
         │
         ├─► NextAuth (JWT Sessions)
         │
         ├─► Proxy Routes (/api/proxy/*)
         │
         ▼
┌─────────────────┐
│  Lambda CRM API │
│   (Function URL)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   DynamoDB      │
│ bruna-agent-    │
│   patients      │
└─────────────────┘
```

---

## Troubleshooting

### Problema: "Error: CRM API URL not configured"
**Solução:** Configurar `CRM_API_URL` nas env vars da Vercel com Lambda URL real

### Problema: "Unauthorized" ao acessar dashboard
**Solução:** Verificar se `NEXTAUTH_SECRET` e `NEXTAUTH_URL` estão configurados corretamente

### Problema: Login não funciona
**Solução:** Verificar se `ADMIN_PASSWORD_HASH` está correto. Regenerar com:
```bash
node -e "console.log(require('bcryptjs').hashSync('BrunaCRM2025!Secure', 10))"
```

### Problema: Métricas não carregam
**Solução:**
1. Verificar se Lambda bruna-crm-crm-api existe e tem Function URL
2. Verificar logs da Lambda no CloudWatch
3. Verificar logs da Vercel em Functions

### Problema: Build falha na Vercel
**Solução:**
1. Verificar logs de build na Vercel
2. Testar build localmente: `npm run build`
3. Verificar se todas as dependências estão no package.json

---

## Segurança

### Checklist de Segurança Implementado
- [x] Autenticação via NextAuth.js
- [x] JWT sessions (sem database)
- [x] Senha com bcrypt hash (10 rounds)
- [x] Environment variables em .env.local (não commitado)
- [x] Proxy routes para esconder Lambda URL do frontend
- [x] Auth check em todas as páginas do dashboard
- [x] HTTPS obrigatório (Vercel SSL automático)

### Próximas Melhorias de Segurança
- [ ] Rate limiting nos proxy routes
- [ ] CORS config na Lambda
- [ ] API Key entre Vercel e Lambda
- [ ] 2FA para admin
- [ ] Audit logs de login

---

## Monitoramento

### Vercel
- **Analytics:** Automático
- **Logs:** Vercel > Projeto > Logs
- **Performance:** Vercel > Projeto > Analytics

### Lambda
- **Logs:** CloudWatch Logs `/aws/lambda/bruna-crm-crm-api`
- **Métricas:** CloudWatch Metrics
- **Alarmes:** Configurar alarme se errors > 10/minuto

---

## Custos Estimados

| Serviço | Plano | Custo Mensal |
|---------|-------|--------------|
| Vercel | Hobby (Free) | $0 |
| Lambda Function URL | Pay-per-use | ~$0.50 |
| DynamoDB | On-demand | ~$2.00 |
| **TOTAL** | | **~$2.50/mês** |

**NOTA:** Vercel Hobby permite 100GB bandwidth/mês grátis. Upgrade para Pro ($20/mês) se ultrapassar.

---

## Comandos Úteis

### Desenvolvimento Local
```bash
npm run dev              # Servidor dev (localhost:3000)
npm run build            # Build produção
npm run start            # Servidor produção local
npm run lint             # ESLint
```

### Vercel CLI (Opcional)
```bash
npm i -g vercel          # Instalar Vercel CLI
vercel                   # Deploy manual
vercel --prod            # Deploy produção
vercel logs              # Ver logs em tempo real
```

### AWS Lambda
```bash
# Testar Lambda diretamente
aws lambda invoke \
  --function-name bruna-crm-crm-api \
  --region us-east-1 \
  --payload '{"path":"/metrics","httpMethod":"GET"}' \
  /tmp/response.json && cat /tmp/response.json | jq
```

---

## Próximas Features

### Fase 7 - Métricas Avançadas (Futuro)
- Timeline de conversões (gráfico Recharts)
- Heatmap de mensagens por dia/hora
- Análise de engajamento por origem
- Comparativo Instagram vs Orgânico

### Fase 8 - Configurações (Futuro)
- Gestão de webhooks Evolution API
- Exportação de dados (CSV/Excel)
- Configuração de notificações
- Gestão de usuários (multi-admin)

---

## Suporte

**Documentação:**
- Next.js: https://nextjs.org/docs
- NextAuth.js: https://next-auth.js.org
- shadcn/ui: https://ui.shadcn.com
- Vercel: https://vercel.com/docs

**Contato:**
- Email: drzamarian@gmail.com
- Dashboard: https://crm.walterzamarian.com.br

---

**Última Atualização:** 16/10/2025 - Dashboard 90% Completo
**Desenvolvido por:** Claude (Bruna Agent Team)
**Domínio Production:** https://crm.walterzamarian.com.br
