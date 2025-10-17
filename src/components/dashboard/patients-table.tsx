// Componente: Patients Table
// Tabela de pacientes com filtros e paginação

"use client";

import { useState } from "react";
import { Patient, STAGE_LABELS, SOURCE_LABELS } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRelativeTime } from "@/lib/api";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface PatientsTableProps {
  patients: Patient[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  onFilterStage?: (stage: string) => void;
  onFilterSource?: (source: string) => void;
}

// Stage badge colors
const STAGE_COLORS: Record<string, string> = {
  new_lead: "bg-blue-100 text-blue-800",
  first_contact: "bg-cyan-100 text-cyan-800",
  consultation_scheduled: "bg-purple-100 text-purple-800",
  consultation_done: "bg-yellow-100 text-yellow-800",
  payment_pending: "bg-orange-100 text-orange-800",
  surgery_closed: "bg-green-100 text-green-800",
};

export function PatientsTable({
  patients,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onSearch,
  onFilterStage,
  onFilterSource,
}: PatientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>

        <Select onValueChange={onFilterStage}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos os estágios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estágios</SelectItem>
            {Object.entries(STAGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onFilterSource}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Todas as origens" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as origens</SelectItem>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {patients.length === 0
              ? "Nenhum paciente encontrado"
              : `Exibindo ${patients.length} pacientes`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Última Interação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.patient_id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {patient.push_name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {patient.phone_number}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={STAGE_COLORS[patient.current_stage]}
                  >
                    {STAGE_LABELS[patient.current_stage]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {SOURCE_LABELS[patient.lead_source]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                        patient.lead_score >= 80
                          ? "bg-green-100 text-green-800"
                          : patient.lead_score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {patient.lead_score}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {getRelativeTime(patient.last_interaction)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
