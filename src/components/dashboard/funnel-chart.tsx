// Componente: Funnel Chart
// Gráfico de funil de vendas (6 estágios) usando Recharts

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelChartData } from "@/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

interface FunnelChartProps {
  data: FunnelChartData[];
  title?: string;
  description?: string;
}

// Cores para cada estágio do funil
const FUNNEL_COLORS = [
  "#0ea5e9", // Sky Blue - new_lead
  "#38bdf8", // Light Sky Blue - first_contact
  "#7dd3fc", // Lighter Sky Blue - consultation_scheduled
  "#bae6fd", // Very Light Sky Blue - consultation_done
  "#e0f2fe", // Extremely Light Sky Blue - payment_pending
  "#10b981", // Green - surgery_closed
];

export function FunnelChart({ data, title, description }: FunnelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Funil de Vendas"}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} pacientes`,
                "Quantidade",
              ]}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend
              formatter={() => "Pacientes por Estágio"}
              iconType="rect"
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              label={{
                position: "right",
                formatter: (value: number, entry: any) =>
                  `${value} (${entry.percentage}%)`,
                fontSize: 12,
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary stats */}
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {data[0]?.value || 0}
            </div>
            <div className="text-xs text-muted-foreground">Leads Totais</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.value || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Cirurgias Fechadas
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data[0]?.value > 0
                ? Math.round(
                    (data[data.length - 1]?.value / data[0]?.value) * 100
                  )
                : 0}
              %
            </div>
            <div className="text-xs text-muted-foreground">
              Taxa de Conversão
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
