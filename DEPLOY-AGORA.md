# DEPLOY AGORA - Dashboard CRM Bruna

**Tempo estimado:** 10-15 minutos
**Data:** 17/10/2025 00:59 (São Paulo)

---

## INFRAESTRUTURA AWS 100% PRONTA

- Certificado SSL: ✅ Emitido e validado (wildcard *.walterzamarianjr.com)
- DNS Route53: ✅ Configurado (crm.walterzamarianjr.com → Vercel)
- Lambda API: ✅ Funcionando
- Código GitHub: ✅ Atualizado (7 commits)

---

## DEPLOY VERCEL - 3 PASSOS SIMPLES

### PASSO 1: Importar Projeto (2 minutos)

1. **Abra o navegador em:** https://vercel.com/new

2. **Login com GitHub:**
   - Usuário: drzamarian-collab
   - Use autenticação GitHub OAuth

3. **Importar repositório:**
   - Procure por: `bruna-crm-dashboard`
   - Clique em **"Import"**

### PASSO 2: Configurar Variáveis (3 minutos)

**IMPORTANTE:** Cole EXATAMENTE estas 5 variáveis no campo "Environment Variables":

**Ambiente:** Production (importante!)

```plaintext
Name: NEXTAUTH_URL
Value: https://crm.walterzamarianjr.com

Name: NEXTAUTH_SECRET
Value: aT0omadfWqRv1hJN0F1suOTBGP3GWr3KROyQOvlrGUQ=

Name: ADMIN_EMAIL
Value: drzamarian@gmail.com

Name: ADMIN_PASSWORD_HASH
Value: $2b$10$39Os7QLZaXJdYV4PuTPpw.SU65pqUjvjQRSvLwMc3cz6zLCuYOz6O

Name: CRM_API_URL
Value: https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
```

**Como adicionar:**
1. Clique em "Add" ao lado de "Environment Variables"
2. Cole o Name no primeiro campo
3. Cole o Value no segundo campo
4. Clique no botão "+" ou "Add"
5. Repita para todas as 5 variáveis
6. **VERIFIQUE** se todas estão marcadas como "Production"

### PASSO 3: Deploy (2 minutos)

1. **Clique no botão:** "Deploy"

2. **Aguarde o build:**
   - Vercel vai:
     - Detectar Next.js automaticamente ✓
     - Instalar dependências (npm install) ✓
     - Executar build (npm run build) ✓
     - Gerar páginas estáticas ✓
     - Deploy automático ✓

   **Tempo:** 1-2 minutos

3. **Deploy completo!**
   - Vercel mostrará uma URL temporária
   - Exemplo: https://bruna-crm-dashboard-abc123.vercel.app

### PASSO 4: Testar Deploy (1 minuto)

1. **Clique na URL temporária** que o Vercel forneceu

2. **Teste o login:**
   - Email: `drzamarian@gmail.com`
   - Senha: `BrunaCRM2025!Secure`

3. **Validações:**
   - ✓ Página de login carrega?
   - ✓ Login funciona?
   - ✓ Dashboard exibe métricas?
   - ✓ Funil de vendas renderiza?

Se tudo funcionar, prossiga para o Passo 5!

### PASSO 5: Adicionar Domínio Customizado (3 minutos)

1. **No Vercel Dashboard, vá para:**
   - Settings → Domains

2. **Adicionar domínio:**
   - Digite: `crm.walterzamarianjr.com`
   - Clique em **"Add"**

3. **Vercel vai detectar:**
   - ✓ CNAME já configurado no Route53
   - ✓ DNS apontando para cname.vercel-dns.com
   - Status: **"Valid Configuration"** (pode levar 2-5 min)

4. **Aguardar propagação DNS:**
   - Tempo: 5-30 minutos
   - Você pode testar com: `nslookup crm.walterzamarianjr.com`
   - Quando propagar, verá: `cname.vercel-dns.com`

5. **Certificado SSL:**
   - Vercel provisiona automaticamente
   - Usa Let's Encrypt
   - HTTPS habilitado automaticamente

### PASSO 6: Validação Final (2 minutos)

**Após DNS propagar, teste:**

1. Acesse: https://crm.walterzamarianjr.com

2. Validações completas:
   - ✓ HTTPS funcionando (cadeado verde)
   - ✓ Login funciona
   - ✓ Dashboard exibe métricas do mês atual
   - ✓ Funil de vendas renderiza corretamente
   - ✓ Lista de pacientes carrega
   - ✓ Proxy routes funcionam (/api/proxy/*)

---

## TROUBLESHOOTING

### Erro: "Environment Variables não aparecem"
**Solução:** Certifique-se de marcar "Production" ao adicionar cada variável

### Erro: "Build Failed"
**Causas comuns:**
- Variáveis de ambiente faltando
- Erro de TypeScript

**Solução:**
1. Vá em: Settings → Environment Variables
2. Verifique se todas as 5 variáveis estão lá
3. Clique em: Deployments → ... → Redeploy

### Erro: "401 Unauthorized" no Dashboard
**Causa:** NextAuth não configurado corretamente

**Solução:**
1. Verifique `NEXTAUTH_URL` está correto
2. Verifique `NEXTAUTH_SECRET` está definido
3. Faça redeploy

### Erro: "Cannot connect to Lambda"
**Causa:** `CRM_API_URL` incorreta

**Solução:**
1. Teste Lambda diretamente:
```bash
curl https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws/metrics/funnel
```

2. Se funcionar, o problema é no dashboard
3. Verifique variável `CRM_API_URL` no Vercel

### DNS não propaga
**Solução:**
```bash
# Verificar DNS atual
dig crm.walterzamarianjr.com

# Deve retornar CNAME: cname.vercel-dns.com

# Flush DNS local (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Aguardar 10-30 minutos
```

### Métricas vazias no Dashboard
**Causas:**
1. Lambda sem dados no DynamoDB
2. Proxy routes com erro

**Solução:**
1. Teste endpoint direto:
```bash
curl https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws/metrics/funnel
```

2. Verifique logs da Lambda:
```bash
aws logs tail /aws/lambda/bruna-crm-api --since 10m --region us-east-1
```

---

## CREDENCIAIS DE REFERÊNCIA

### Dashboard
- **URL Final:** https://crm.walterzamarianjr.com
- **Email:** drzamarian@gmail.com
- **Senha:** BrunaCRM2025!Secure

### Lambda CRM API
- **URL:** https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
- **Endpoints:**
  - `/metrics/funnel` - Funil de vendas
  - `/metrics/monthly` - Métricas mensais
  - `/patients` - Lista de pacientes

### AWS Resources
- **Região:** us-east-1
- **Hosted Zone:** Z1ETMTAR0URKTY (walterzamarianjr.com)
- **Certificate ARN:** arn:aws:acm:us-east-1:393474388991:certificate/465bdf28-82f1-45f9-b961-4cea33f111df

---

## LINKS RÁPIDOS

- **Vercel Import:** https://vercel.com/new
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/drzamarian-collab/bruna-crm-dashboard
- **Lambda API:** https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws

---

## CHECKLIST FINAL

Use este checklist durante o deploy:

- [ ] Acessei https://vercel.com/new
- [ ] Fiz login com GitHub (drzamarian-collab)
- [ ] Importei repositório bruna-crm-dashboard
- [ ] Adicionei as 5 environment variables (Production)
- [ ] Cliquei em "Deploy"
- [ ] Build completou com sucesso
- [ ] Testei URL temporária do Vercel
- [ ] Login funcionou
- [ ] Dashboard exibe métricas
- [ ] Adicionei domínio customizado (crm.walterzamarianjr.com)
- [ ] Vercel validou o domínio (Valid Configuration)
- [ ] Aguardei propagação DNS (5-30 min)
- [ ] Acessei https://crm.walterzamarianjr.com
- [ ] HTTPS funcionando
- [ ] Validação end-to-end completa

---

## RESUMO DO QUE FOI FEITO

**Infraestrutura AWS:**
- ✅ Certificado SSL wildcard emitido e validado
- ✅ DNS Route53 configurado para Vercel
- ✅ CNAME crm.walterzamarianjr.com → cname.vercel-dns.com
- ✅ Lambda CRM API funcionando e testada

**Código e Documentação:**
- ✅ Repositório GitHub completo (7 commits)
- ✅ Next.js 14 + TypeScript configurado
- ✅ shadcn/ui + Tailwind CSS
- ✅ NextAuth.js com JWT
- ✅ 3 proxy routes autenticados
- ✅ 5 componentes dashboard
- ✅ Documentação completa (DEPLOY-VERCEL.md, QUICK-START.md, STATUS-FINAL.md)

**Próximo Passo:**
- ⏳ Deploy manual Vercel (este guia - 10-15 minutos)

---

**IMPORTANTE:** Todos os recursos AWS estão prontos e aguardando. Basta importar no Vercel e adicionar as variáveis de ambiente!

**Tempo total estimado:** 10-15 minutos
**Dificuldade:** Muito fácil (point-and-click)

**BOA SORTE! 🚀**
