// API Client para Dashboard CRM - Clínica Zamarian
// Integração com Lambda bruna-crm-crm-api via Next.js proxy routes

import {
  Metrics,
  PatientsResponse,
  CalendarResponse,
  PatientsQueryParams,
  CalendarQueryParams,
  ApiResponse,
} from "@/types";

// Base URL para proxy routes (Next.js API routes)
const API_BASE = "/api/proxy";

// ==================== HELPERS ====================

/**
 * Generic fetch wrapper com error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      return {
        success: false,
        error: errorData.error || `Erro ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// ==================== METRICS API ====================

/**
 * Fetch CRM metrics (overview, funnel, sources, timeline)
 *
 * @returns Metrics data with overview, funnel, sources, and timeline
 *
 * @example
 * const { success, data, error } = await fetchMetrics();
 * if (success) {
 *   console.log(`Total leads: ${data.overview.total_leads}`);
 *   console.log(`Conversion rate: ${data.overview.conversion_rate}%`);
 * }
 */
export async function fetchMetrics(): Promise<ApiResponse<Metrics>> {
  return apiFetch<Metrics>("/metrics");
}

// ==================== PATIENTS API ====================

/**
 * Fetch patients list with optional filters
 *
 * @param params - Query parameters (search, stage, source, page, limit)
 * @returns Patients list with pagination data
 *
 * @example
 * const { success, data } = await fetchPatients({
 *   search: "Maria",
 *   stage: "consultation_scheduled",
 *   page: 1,
 *   limit: 20
 * });
 *
 * if (success) {
 *   console.log(`Found ${data.pagination.total} patients`);
 *   data.patients.forEach(p => console.log(p.push_name));
 * }
 */
export async function fetchPatients(
  params: PatientsQueryParams = {}
): Promise<ApiResponse<PatientsResponse>> {
  const queryString = buildQueryString(params);
  return apiFetch<PatientsResponse>(`/patients${queryString}`);
}

/**
 * Fetch single patient by ID
 *
 * @param patientId - Patient UUID
 * @returns Patient data
 *
 * @example
 * const { success, data } = await fetchPatientById("uuid-123");
 * if (success) {
 *   console.log(`Patient: ${data.push_name}`);
 * }
 */
export async function fetchPatientById(
  patientId: string
): Promise<ApiResponse<any>> {
  return apiFetch<any>(`/patients/${patientId}`);
}

// ==================== CALENDAR API ====================

/**
 * Fetch calendar appointments with optional filters
 *
 * @param params - Query parameters (start_date, end_date, status)
 * @returns Calendar appointments list
 *
 * @example
 * const { success, data } = await fetchCalendar({
 *   start_date: "2025-10-01",
 *   end_date: "2025-10-31",
 *   status: "confirmed"
 * });
 *
 * if (success) {
 *   console.log(`${data.appointments.length} appointments`);
 * }
 */
export async function fetchCalendar(
  params: CalendarQueryParams = {}
): Promise<ApiResponse<CalendarResponse>> {
  const queryString = buildQueryString(params);
  return apiFetch<CalendarResponse>(`/calendar${queryString}`);
}

// ==================== CHART DATA TRANSFORMERS ====================

import {
  FunnelChartData,
  SourceChartData,
  TimelineChartData,
  STAGE_LABELS,
  SOURCE_LABELS,
} from "@/types";

/**
 * Transform metrics.funnel to funnel chart data with percentages
 */
export function transformFunnelData(
  funnel: Metrics["funnel"]
): FunnelChartData[] {
  const stages: Array<keyof typeof funnel> = [
    "new_lead",
    "first_contact",
    "consultation_scheduled",
    "consultation_done",
    "payment_pending",
    "surgery_closed",
  ];

  const total = funnel.new_lead || 1; // Evita divisão por zero

  return stages.map((stage) => ({
    name: STAGE_LABELS[stage],
    value: funnel[stage],
    percentage: Math.round((funnel[stage] / total) * 100),
  }));
}

/**
 * Transform metrics.sources to source chart data with percentages
 */
export function transformSourceData(
  sources: Metrics["sources"]
): SourceChartData[] {
  const total = sources.instagram + sources.organic || 1; // Evita divisão por zero

  return [
    {
      name: SOURCE_LABELS.instagram,
      value: sources.instagram,
      percentage: Math.round((sources.instagram / total) * 100),
    },
    {
      name: SOURCE_LABELS.organic,
      value: sources.organic,
      percentage: Math.round((sources.organic / total) * 100),
    },
  ];
}

/**
 * Transform metrics.timeline to timeline chart data
 */
export function transformTimelineData(
  timeline: Metrics["timeline"]
): TimelineChartData[] {
  return timeline.map((entry) => ({
    date: entry.date,
    conversions: entry.conversions,
  }));
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format ROI value to Brazilian currency (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Format percentage with 1 decimal place
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format date to Brazilian format (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

/**
 * Format datetime to Brazilian format with time (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

/**
 * Calculate days since date
 */
export function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get relative time string (ex: "2 dias atrás", "1 hora atrás")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "agora mesmo";
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  return formatDate(dateString);
}
