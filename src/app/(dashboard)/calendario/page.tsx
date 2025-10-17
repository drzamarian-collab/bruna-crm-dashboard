// Página: Calendário
// Visualização de consultas agendadas

"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { fetchCalendar } from "@/lib/api";
import { Appointment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarioPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCalendar() {
      const { success, data, error: fetchError } = await fetchCalendar();

      if (success && data) {
        setAppointments(data.appointments);
      } else {
        setError(fetchError || "Erro ao carregar calendário");
      }

      setLoading(false);
    }

    loadCalendar();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">Consultas agendadas</p>
        </div>

        <Card className="animate-pulse">
          <CardContent className="h-96" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">Consultas agendadas</p>
        </div>

        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <div className="text-destructive font-semibold mb-2">
              Erro ao carregar calendário
            </div>
            <p className="text-sm text-muted-foreground">
              {error || "Verifique a conexão com a API"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">
            {appointments.length}{" "}
            {appointments.length === 1 ? "consulta agendada" : "consultas agendadas"}
          </p>
        </div>
      </div>

      {/* Calendar View */}
      <CalendarView appointments={appointments} />
    </div>
  );
}
