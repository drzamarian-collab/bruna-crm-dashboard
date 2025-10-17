// Componente: Calendar View
// Visualização de consultas agendadas

"use client";

import { Appointment, APPOINTMENT_STATUS_LABELS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/api";
import { Calendar, Clock, DollarSign, User } from "lucide-react";

interface CalendarViewProps {
  appointments: Appointment[];
}

// Status badge colors
const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

export function CalendarView({ appointments }: CalendarViewProps) {
  // Group by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(groupedAppointments).sort();

  return (
    <div className="space-y-4">
      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
            Nenhuma consulta agendada
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(date)}
                <span className="text-sm font-normal text-muted-foreground">
                  ({groupedAppointments[date].length}{" "}
                  {groupedAppointments[date].length === 1
                    ? "consulta"
                    : "consultas"}
                  )
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {groupedAppointments[date]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.appointment_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {appointment.patient_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.time}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium text-foreground">
                          {appointment.procedure}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(appointment.payment_amount)}</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono text-xs">
                          {appointment.patient_phone}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[appointment.status]}
                      >
                        {APPOINTMENT_STATUS_LABELS[appointment.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
