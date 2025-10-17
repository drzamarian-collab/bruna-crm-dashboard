// Proxy Route: GET /api/proxy/calendar
// Encaminha requisições para Lambda bruna-crm-crm-api com query params

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

    // Extrair query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Fazer requisição para a Lambda com query params
    const lambdaUrl = queryString
      ? `${crmApiUrl}/calendar?${queryString}`
      : `${crmApiUrl}/calendar`;

    const response = await fetch(lambdaUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CRM API error:", errorText);
      return NextResponse.json(
        { error: `Erro na Lambda CRM API: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy calendar error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
