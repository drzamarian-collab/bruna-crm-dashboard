// TypeScript Types para Dashboard CRM - Clínica Zamarian
// Baseado nas especificações da Lambda bruna-crm-crm-api

// ==================== PATIENT TYPES ====================

export interface Patient {
  patient_id: string;
  phone_number: string;
  push_name: string;
  current_stage: PatientStage;
  lead_source: LeadSource;
  lead_score: number;
  messages_count: number;
  last_interaction: string; // ISO 8601 timestamp
  created_at: string; // ISO 8601 timestamp
}

export type PatientStage =
  | "new_lead"
  | "first_contact"
  | "consultation_scheduled"
  | "consultation_done"
  | "payment_pending"
  | "surgery_closed";

export type LeadSource = "instagram" | "organic";

export const STAGE_LABELS: Record<PatientStage, string> = {
  new_lead: "Novo Lead",
  first_contact: "Primeiro Contato",
  consultation_scheduled: "Consulta Agendada",
  consultation_done: "Consulta Realizada",
  payment_pending: "Pagamento Pendente",
  surgery_closed: "Cirurgia Fechada",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  instagram: "Instagram",
  organic: "Orgânico",
};

// ==================== METRICS TYPES ====================

export interface Metrics {
  overview: MetricsOverview;
  funnel: FunnelMetrics;
  sources: SourceMetrics;
  timeline: TimelineMetric[];
}

export interface MetricsOverview {
  total_leads: number;
  conversion_rate: number; // Percentage (0-100)
  scheduled_appointments: number;
  estimated_roi: number; // R$
}

export interface FunnelMetrics {
  new_lead: number;
  first_contact: number;
  consultation_scheduled: number;
  consultation_done: number;
  payment_pending: number;
  surgery_closed: number;
}

export interface SourceMetrics {
  instagram: number;
  organic: number;
}

export interface TimelineMetric {
  date: string; // YYYY-MM-DD format
  conversions: number;
}

// ==================== CALENDAR TYPES ====================

export interface Appointment {
  appointment_id: string;
  patient_name: string;
  patient_phone: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  procedure: string;
  status: AppointmentStatus;
  payment_amount: number; // R$
}

export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirmada",
  pending: "Pendente",
  cancelled: "Cancelada",
};

// ==================== API RESPONSE TYPES ====================

export interface PatientsResponse {
  patients: Patient[];
  pagination: PaginationData;
}

export interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

export interface CalendarResponse {
  appointments: Appointment[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== QUERY PARAMS TYPES ====================

export interface PatientsQueryParams {
  search?: string;
  stage?: PatientStage;
  source?: LeadSource;
  page?: number;
  limit?: number;
}

export interface CalendarQueryParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  status?: AppointmentStatus;
}

// ==================== CHART DATA TYPES ====================

export interface FunnelChartData {
  name: string;
  value: number;
  percentage: number;
}

export interface SourceChartData {
  name: string;
  value: number;
  percentage: number;
}

export interface TimelineChartData {
  date: string;
  conversions: number;
}

// ==================== UTILITY TYPES ====================

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export const STAGE_OPTIONS: FilterOption<PatientStage>[] = [
  { label: "Novo Lead", value: "new_lead" },
  { label: "Primeiro Contato", value: "first_contact" },
  { label: "Consulta Agendada", value: "consultation_scheduled" },
  { label: "Consulta Realizada", value: "consultation_done" },
  { label: "Pagamento Pendente", value: "payment_pending" },
  { label: "Cirurgia Fechada", value: "surgery_closed" },
];

export const SOURCE_OPTIONS: FilterOption<LeadSource>[] = [
  { label: "Instagram", value: "instagram" },
  { label: "Orgânico", value: "organic" },
];

export const APPOINTMENT_STATUS_OPTIONS: FilterOption<AppointmentStatus>[] = [
  { label: "Confirmada", value: "confirmed" },
  { label: "Pendente", value: "pending" },
  { label: "Cancelada", value: "cancelled" },
];
