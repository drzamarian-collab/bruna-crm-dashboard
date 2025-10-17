// Página: Overview Dashboard
// Página principal com métricas gerais, funil de vendas e gráficos

"use client";

import { useEffect, useState } from "react";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import {
  fetchMetrics,
  transformFunnelData,
  formatCurrency,
  formatPercentage,
} from "@/lib/api";
import { Metrics } from "@/types";
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const { success, data, error: fetchError } = await fetchMetrics();

      if (success && data) {
        setMetrics(data);
      } else {
        setError(fetchError || "Erro ao carregar métricas");
      }

      setLoading(false);
    }

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard CRM</h1>
          <p className="text-muted-foreground">Visão geral da Clínica Zamarian</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>

        <Card className="animate-pulse">
          <CardContent className="h-96" />
        </Card>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard CRM</h1>
          <p className="text-muted-foreground">Visão geral da Clínica Zamarian</p>
        </div>

        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <div className="text-destructive font-semibold mb-2">
              Erro ao carregar métricas
            </div>
            <p className="text-sm text-muted-foreground">
              {error || "Verifique a conexão com a API"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const funnelData = transformFunnelData(metrics.funnel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard CRM</h1>
        <p className="text-muted-foreground">
          Visão geral da Clínica Zamarian
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total de Leads"
          value={metrics.overview.total_leads}
          description="Últimos 30 dias"
          icon={Users}
        />

        <MetricsCard
          title="Taxa de Conversão"
          value={formatPercentage(metrics.overview.conversion_rate)}
          description="Lead → Cirurgia"
          icon={TrendingUp}
        />

        <MetricsCard
          title="Consultas Agendadas"
          value={metrics.overview.scheduled_appointments}
          description="Semana atual"
          icon={Calendar}
        />

        <MetricsCard
          title="ROI Estimado"
          value={formatCurrency(metrics.overview.estimated_roi)}
          description="Retorno sobre investimento"
          icon={DollarSign}
        />
      </div>

      {/* Funnel Chart */}
      <FunnelChart
        data={funnelData}
        title="Funil de Vendas"
        description="Jornada completa do lead à cirurgia fechada"
      />

      {/* Metrics por Origem */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {metrics.sources.instagram}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Leads via Instagram
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {Math.round(
                  (metrics.sources.instagram /
                    (metrics.sources.instagram + metrics.sources.organic)) *
                    100
                )}
                % do total
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {metrics.sources.organic}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Leads Orgânicos
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {Math.round(
                  (metrics.sources.organic /
                    (metrics.sources.instagram + metrics.sources.organic)) *
                    100
                )}
                % do total
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
