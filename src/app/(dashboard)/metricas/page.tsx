// Página: Métricas Avançadas
// Análises detalhadas e relatórios

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function MetricasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Métricas Avançadas</h1>
        <p className="text-muted-foreground">
          Análises detalhadas e relatórios personalizados
        </p>
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-sm text-muted-foreground">
            Métricas avançadas em breve
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
