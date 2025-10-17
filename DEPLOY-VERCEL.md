# Guia de Deploy - Dashboard CRM Bruna (Vercel)

**Data:** 17/10/2025
**Repositório GitHub:** https://github.com/drzamarian-collab/bruna-crm-dashboard
**Domínio Final:** https://crm.walterzamarian.com.br

---

## Passo 1: Importar Projeto no Vercel (5 minutos)

### 1.1 Acessar Vercel
1. Acesse: https://vercel.com
2. Login com conta GitHub (drzamarian-collab)

### 1.2 Importar Repositório
1. Clique em **"Add New Project"**
2. Selecione **"Import Git Repository"**
3. Busque por: `bruna-crm-dashboard`
4. Clique em **"Import"**

### 1.3 Configurações do Projeto
- **Framework Preset:** Next.js (detectado automaticamente)
- **Root Directory:** `./` (raiz)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

---

## Passo 2: Configurar Variáveis de Ambiente (5 minutos)

### 2.1 Adicionar Environment Variables

No painel de configuração do projeto Vercel, adicione as seguintes variáveis:

#### Production (crm.walterzamarian.com.br)
```env
NEXTAUTH_URL=https://crm.walterzamarian.com.br
NEXTAUTH_SECRET=aT0omadfWqRv1hJN0F1suOTBGP3GWr3KROyQOvlrGUQ=
ADMIN_EMAIL=drzamarian@gmail.com
ADMIN_PASSWORD_HASH=$2b$10$39Os7QLZaXJdYV4PuTPpw.SU65pqUjvjQRSvLwMc3cz6zLCuYOz6O
CRM_API_URL=https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
```

#### Preview (opcional - para branches de desenvolvimento)
```env
NEXTAUTH_URL=https://bruna-crm-dashboard-git-preview.vercel.app
NEXTAUTH_SECRET=aT0omadfWqRv1hJN0F1suOTBGP3GWr3KROyQOvlrGUQ=
ADMIN_EMAIL=drzamarian@gmail.com
ADMIN_PASSWORD_HASH=$2b$10$39Os7QLZaXJdYV4PuTPpw.SU65pqUjvjQRSvLwMc3cz6zLCuYOz6O
CRM_API_URL=https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
```

### 2.2 Credenciais de Login
- **Email:** drzamarian@gmail.com
- **Senha:** BrunaCRM2025!Secure

---

## Passo 3: Deploy Inicial (3 minutos)

### 3.1 Iniciar Deploy
1. Clique em **"Deploy"** após configurar as variáveis
2. Aguarde o build (estimativa: 2-3 minutos)
3. Vercel irá:
   - Instalar dependências (npm install)
   - Executar build (npm run build)
   - Gerar páginas estáticas
   - Deploy automático

### 3.2 Validar Deploy
Após deploy completo, a Vercel fornecerá uma URL temporária:
- Formato: `https://bruna-crm-dashboard-HASH.vercel.app`
- Acesse a URL e teste o login

#### Checklist de Validação
- [ ] Página de login carrega corretamente
- [ ] Login com credenciais funciona
- [ ] Dashboard exibe métricas (funil de vendas)
- [ ] Página de pacientes carrega
- [ ] Proxy routes funcionam (sem erro 401/404)

---

## Passo 4: Configurar Domínio Customizado (5 minutos)

### 4.1 Adicionar Domínio no Vercel
1. Acesse: **Settings → Domains**
2. Clique em **"Add Domain"**
3. Digite: `crm.walterzamarian.com.br`
4. Clique em **"Add"**

### 4.2 Configurar DNS no Route53

Vercel irá solicitar um dos seguintes registros DNS:

#### Opção A: CNAME (Recomendado)
```
Type: CNAME
Name: crm
Value: cname.vercel-dns.com
TTL: 300
```

#### Opção B: A Record (Alternativa)
```
Type: A
Name: crm
Value: 76.76.21.21
TTL: 300
```

### 4.3 Adicionar DNS no Route53 (AWS)

```bash
# Via AWS CLI
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "crm.walterzamarian.com.br",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "cname.vercel-dns.com"}]
      }
    }]
  }'
```

### 4.4 Aguardar Propagação DNS
- **Tempo estimado:** 5-30 minutos
- **Verificar:** `nslookup crm.walterzamarian.com.br`
- **Status Vercel:** Aguardar "Valid Configuration" em Domains

### 4.5 Atualizar NEXTAUTH_URL (IMPORTANTE!)
Após DNS propagado:
1. Acesse **Settings → Environment Variables**
2. Edite `NEXTAUTH_URL` para: `https://crm.walterzamarian.com.br`
3. Clique em **"Save"**
4. **Redeploy** o projeto (Deployments → ... → Redeploy)

---

## Passo 5: Configuração CORS Lambda (Opcional)

Se encontrar erros de CORS ao acessar via domínio customizado:

### 5.1 Atualizar CORS da Lambda
```bash
aws lambda update-function-url-config \
  --function-name bruna-crm-api \
  --cors '{
    "AllowOrigins": [
      "https://crm.walterzamarian.com.br",
      "http://localhost:3000"
    ],
    "AllowMethods": ["GET", "POST"],
    "AllowHeaders": ["*"],
    "MaxAge": 86400
  }' \
  --region us-east-1
```

### 5.2 Testar Endpoints
```bash
# Teste direto da Lambda
curl https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws/metrics/funnel

# Teste via Dashboard
curl -H "Cookie: next-auth.session-token=..." \
  https://crm.walterzamarian.com.br/api/proxy/metrics
```

---

## Troubleshooting

### Erro: "Build Failed"
**Causa:** Dependências faltando ou erro de TypeScript
**Solução:**
```bash
# Testar build localmente
cd /Users/walter/projetos/bruna-crm-dashboard
npm run build

# Se houver erros, corrija e faça push
git add .
git commit -m "fix: corrige erro de build"
git push
```

### Erro: "401 Unauthorized" no Dashboard
**Causa:** NextAuth não configurado corretamente
**Solução:**
1. Verificar `NEXTAUTH_URL` em Environment Variables
2. Verificar `NEXTAUTH_SECRET` está definido
3. Redeploy após alterar variáveis

### Erro: "Cannot connect to Lambda"
**Causa:** `CRM_API_URL` incorreta ou Lambda offline
**Solução:**
```bash
# Testar Lambda diretamente
curl https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws/metrics/funnel

# Verificar logs Lambda
aws logs tail /aws/lambda/bruna-crm-api --since 10m --region us-east-1
```

### DNS não propaga
**Causa:** Cache DNS ou configuração incorreta
**Solução:**
```bash
# Verificar DNS
dig crm.walterzamarian.com.br

# Flush DNS local (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Aguardar 10-30 minutos para propagação global
```

### Página carrega mas métricas vazias
**Causa:** Dados vazios no DynamoDB ou Lambda retornando erro
**Solução:**
1. Verificar CloudWatch Logs da Lambda `bruna-crm-api`
2. Testar endpoint `/metrics/funnel` diretamente
3. Verificar tabela `bruna-crm-funnel-snapshot` no DynamoDB

---

## Monitoramento Pós-Deploy

### Logs do Vercel
- **Acesso:** Vercel Dashboard → Deployments → View Function Logs
- **Uso:** Verificar erros de runtime do Next.js

### Logs da Lambda
```bash
# Logs em tempo real
aws logs tail /aws/lambda/bruna-crm-api --follow --region us-east-1

# Últimos 30 minutos
aws logs tail /aws/lambda/bruna-crm-api --since 30m --region us-east-1
```

### Métricas do DynamoDB
```bash
# Verificar dados da tabela funnel
aws dynamodb scan \
  --table-name bruna-crm-funnel-snapshot \
  --limit 5 \
  --region us-east-1

# Verificar dados de pacientes
aws dynamodb scan \
  --table-name bruna-agent-patients \
  --limit 5 \
  --region us-east-1
```

---

## Checklist Final de Validação

### Funcionalidades Core
- [ ] Login funciona (drzamarian@gmail.com)
- [ ] Dashboard exibe métricas do mês atual
- [ ] Funil de vendas renderiza corretamente
- [ ] Lista de pacientes carrega
- [ ] Detalhes de paciente acessíveis
- [ ] Logout funciona

### Integrações
- [ ] Proxy `/api/proxy/metrics` retorna dados
- [ ] Proxy `/api/proxy/patients` retorna lista
- [ ] Lambda CRM API responde sem erros
- [ ] CORS configurado corretamente

### Performance
- [ ] Tempo de carregamento da página < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90 (Performance)

### SEO e Acessibilidade
- [ ] Meta tags configuradas
- [ ] Favicon visível
- [ ] Lighthouse Score > 90 (Accessibility)
- [ ] Título da página correto

---

## URLs Importantes

- **GitHub:** https://github.com/drzamarian-collab/bruna-crm-dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Production:** https://crm.walterzamarian.com.br
- **Lambda API:** https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws

---

## Próximos Passos (Pós-Deploy)

1. **Monitoramento:** Configurar alertas Vercel para erros 5xx
2. **Analytics:** Adicionar Vercel Analytics ou Google Analytics
3. **Backup:** Configurar backup automático do repositório
4. **CI/CD:** Configurar testes automáticos no GitHub Actions
5. **Documentação:** Adicionar README.md com instruções de uso

---

**Tempo Total Estimado:** 18-23 minutos
**Status:** Pronto para deploy ✅
**Última Atualização:** 17/10/2025
