// Página: Pacientes
// Lista de pacientes com filtros e paginação

"use client";

import { useEffect, useState } from "react";
import { PatientsTable } from "@/components/dashboard/patients-table";
import { fetchPatients } from "@/lib/api";
import { Patient, PatientsQueryParams, PatientStage, LeadSource } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState<PatientsQueryParams>({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      const { success, data, error: fetchError } = await fetchPatients(filters);

      if (success && data) {
        setPatients(data.patients);
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.page);
      } else {
        setError(fetchError || "Erro ao carregar pacientes");
      }

      setLoading(false);
    }

    loadPatients();
  }, [filters]);

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleFilterStage = (stage: string) => {
    if (stage === "all") {
      const { stage: _, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    } else {
      setFilters({ ...filters, stage: stage as PatientStage, page: 1 });
    }
  };

  const handleFilterSource = (source: string) => {
    if (source === "all") {
      const { source: _, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    } else {
      setFilters({ ...filters, source: source as LeadSource, page: 1 });
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (loading && patients.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus pacientes
          </p>
        </div>

        <Card className="animate-pulse">
          <CardContent className="h-96" />
        </Card>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus pacientes
          </p>
        </div>

        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <div className="text-destructive font-semibold mb-2">
              Erro ao carregar pacientes
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
      <div>
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe seus pacientes
        </p>
      </div>

      {/* Patients Table */}
      <PatientsTable
        patients={patients}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onFilterStage={handleFilterStage}
        onFilterSource={handleFilterSource}
      />
    </div>
  );
}
