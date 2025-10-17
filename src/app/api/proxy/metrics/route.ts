// Proxy Route: GET /api/proxy/metrics
// Encaminha requisições para Lambda bruna-crm-crm-api

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // URL da Lambda CRM API
    const crmApiUrl = process.env.CRM_API_URL;
    if (!crmApiUrl) {
      return NextResponse.json(
        { error: "CRM_API_URL não configurada" },
        { status: 500 }
      );
    }

    // Fazer requisições paralelas para a Lambda
    const [funnelResponse, monthlyResponse] = await Promise.all([
      fetch(`${crmApiUrl}/metrics/funnel`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`${crmApiUrl}/metrics/monthly`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    // Verificar erros nas respostas
    if (!funnelResponse.ok || !monthlyResponse.ok) {
      const errors = [];
      if (!funnelResponse.ok) errors.push(`funnel: ${funnelResponse.status}`);
      if (!monthlyResponse.ok)
        errors.push(`monthly: ${monthlyResponse.status}`);
      console.error("CRM API errors:", errors);
      return NextResponse.json(
        { error: `Erro na Lambda CRM API: ${errors.join(", ")}` },
        { status: 500 }
      );
    }

    // Combinar dados de ambos endpoints
    const funnelData = await funnelResponse.json();
    const monthlyData = await monthlyResponse.json();

    // Formato compatível com o Dashboard
    const combinedData = {
      success: funnelData.success && monthlyData.success,
      overview: monthlyData.data || {},
      funnel: funnelData.data || [],
      sources: {
        instagram: 0,
        organic: 0,
      }, // TODO: implementar quando disponível
      timeline: [], // TODO: implementar quando disponível
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Proxy metrics error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
