// Página: Configurações
// Configurações do dashboard e integrações

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure integrações e preferências do sistema
        </p>
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-sm text-muted-foreground">
            Configurações em breve
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
