# Quick Start - Deploy Dashboard CRM (5 minutos)

**Status:** Código no GitHub, pronto para deploy ✅
**URL GitHub:** https://github.com/drzamarian-collab/bruna-crm-dashboard

---

## Deploy Rápido (3 passos - 15 minutos)

### Passo 1: Importar no Vercel (3 min)

1. **Abra:** https://vercel.com/new
2. **Login:** GitHub (drzamarian-collab)
3. **Selecione:** `bruna-crm-dashboard`
4. **Clique:** "Import"

### Passo 2: Configurar Variáveis (5 min)

Cole estas 5 variáveis em **Environment Variables**:

```
NEXTAUTH_URL
https://crm.walterzamarianjr.com

NEXTAUTH_SECRET
aT0omadfWqRv1hJN0F1suOTBGP3GWr3KROyQOvlrGUQ=

ADMIN_EMAIL
drzamarian@gmail.com

ADMIN_PASSWORD_HASH
$2b$10$39Os7QLZaXJdYV4PuTPpw.SU65pqUjvjQRSvLwMc3cz6zLCuYOz6O

CRM_API_URL
https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
```

**IMPORTANTE:** Aplique para **"Production"** environment

### Passo 3: Deploy (2 min)

1. Clique **"Deploy"**
2. Aguarde build (1-2 min)
3. ✅ Deploy concluído!

---

## Teste Rápido

Quando deploy terminar, Vercel mostrará uma URL:

**Exemplo:** `https://bruna-crm-dashboard-abc123.vercel.app`

### Validação (30 segundos):
1. Acesse a URL
2. Login: `drzamarian@gmail.com` / `BrunaCRM2025!Secure`
3. Verifique se dashboard carrega com métricas
4. ✅ Se funcionar, sucesso!

---

## Domínio Customizado (Opcional - 7 min)

### No Vercel:
1. **Settings → Domains**
2. Digite: `crm.walterzamarianjr.com`
3. Clique **"Add"**

### DNS Route53:
Vercel mostrará qual registro adicionar. Geralmente:

```
Type: CNAME
Name: crm
Value: cname.vercel-dns.com
TTL: 300
```

### Após DNS configurado:
1. Aguarde 5-30 min (propagação)
2. **Environment Variables:** Edite `NEXTAUTH_URL` para o domínio customizado
3. **Deployments:** Faça "Redeploy"

---

## Credenciais

**Login Dashboard:**
- Email: `drzamarian@gmail.com`
- Senha: `BrunaCRM2025!Secure`

**Lambda URL:**
```
https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws
```

---

## Troubleshooting

### Build Falhou?
Verifique se todas as 5 variáveis foram configuradas.

### Login não funciona?
Verifique `NEXTAUTH_URL` e `NEXTAUTH_SECRET` nas variáveis.

### Métricas vazias?
Lambda pode estar offline. Teste:
```bash
curl https://xdvf43bgtiym34uqunyjw2e4ci0jmkfz.lambda-url.us-east-1.on.aws/metrics/funnel
```

---

## Resumo

✅ **Código:** GitHub ready
✅ **Backend:** Lambda API funcionando
✅ **Documentação:** DEPLOY-VERCEL.md completo
⏳ **Deploy:** Aguardando importação Vercel

**Próximo:** Abra https://vercel.com/new e importe o projeto!

---

**Tempo total estimado:** 15-20 minutos (com domínio customizado)
