# Dashboard CRM - Clínica Zamarian

Dashboard web completo para gestão do CRM da Clínica Zamarian, integrando dados em tempo real do WhatsApp via AWS Lambda e DynamoDB.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-purple)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange?logo=amazon-aws)

## 🎯 Visão Geral

Sistema de CRM médico que consolida dados de pacientes provenientes do WhatsApp (via Bruna Agent), apresentando métricas, funil de vendas e gestão de pacientes em interface moderna e responsiva.

**URL Production:** https://crm.walterzamarian.com.br

## 🚀 Começando

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn
- Conta AWS (Lambda + DynamoDB)

### Instalação
\`\`\`bash
npm install
cp .env.local.example .env.local
# Edite .env.local com suas credenciais
npm run dev
\`\`\`

## 📚 Documentação
- [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md) - Guia de deploy completo
- [STATUS.md](./STATUS.md) - Status de implementação
- [DASHBOARD-SPECS.md](./DASHBOARD-SPECS.md) - Especificações funcionais

## 🔗 Links
- **Production:** https://crm.walterzamarian.com.br
- **GitHub:** https://github.com/drzamarian-collab/bruna-crm-dashboard

---
**Versão:** 1.0.0 | **Status:** Pronto para produção ✅
