"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart } from "lucide-react";

// Import des composants personnalisés
import AnalyticsReportCard from "@/components/_organisms/AnalyticsReportCard/AnalyticsReportCard";
import AnalyticsReportContent from "@/components/_organisms/AnalyticsReportContent/AnalyticsReportContent";
import FilterDialog, { FilterOption } from "@/components/FilterDialog";

// Import des mocks
import {
  ReportData,
  getReportById,
  getReportsByCategory,
} from "@/mocks/analyticsReportsMocks";

/**
 * Page des rapports annuels
 */
export default function AnnualReportsPage() {
  // État pour stocker les rapports
  const [reports, setReports] = useState<ReportData[]>([]);

  // État pour stocker le rapport sélectionné
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // État pour l'année sélectionnée
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  // État pour le chargement
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // État pour la boîte de dialogue des filtres
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  // Liste des années disponibles
  const availableYears = [
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
  ];

  // Effet pour charger les rapports
  useEffect(() => {
    setIsLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      // Récupérer tous les rapports et filtrer ceux qui sont pertinents pour les rapports annuels
      const allReports = [
        ...getReportsByCategory("financial"),
        ...getReportsByCategory("performance"),
        ...getReportsByCategory("user"),
        ...getReportsByCategory("provider"),
      ];

      // Filtrer les rapports qui contiennent l'année sélectionnée dans leur période
      const filteredReports = allReports.filter(
        (report) =>
          report.period.toLowerCase().includes("annuel") ||
          report.period.includes(selectedYear)
      );

      setReports(filteredReports);

      // Sélectionner le premier rapport par défaut
      if (filteredReports.length > 0) {
        setSelectedReport(filteredReports[0]);
      } else {
        setSelectedReport(null);
      }

      setIsLoading(false);
    }, 500);
  }, [selectedYear]);

  // Gestionnaire pour la sélection d'un rapport
  const handleReportSelect = (report: ReportData) => {
    setIsLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      setSelectedReport(report);
      setIsLoading(false);
    }, 300);
  };

  // Gestionnaire pour l'exportation
  const handleExport = (format: string, reportId: string) => {
    console.log(`Exporting report ${reportId} in ${format} format`);
    // Logique d'exportation à implémenter
  };

  // Gestionnaire pour le partage
  const handleShare = (reportId: string) => {
    console.log(`Sharing report ${reportId}`);
    // Logique de partage à implémenter
  };

  // Gestionnaire pour le rafraîchissement
  const handleRefresh = (reportId: string) => {
    console.log(`Refreshing report ${reportId}`);
    setIsLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      // Mettre à jour le rapport sélectionné avec des données fraîches
      const refreshedReport = getReportById(reportId);
      if (refreshedReport) {
        setSelectedReport({
          ...refreshedReport,
          lastUpdated: new Date().toISOString(),
        });
      }
      setIsLoading(false);
    }, 800);
  };

  // Fonction pour obtenir les options de filtre en fonction du nom du filtre
  const getFilterOptions = (filterName: string): string[] => {
    switch (filterName) {
      case "Période":
        return [
          "Année complète",
          "Premier semestre",
          "Second semestre",
          "Personnalisé",
        ];
      case "Comparaison":
        return [
          "Objectifs",
          "Année précédente",
          "Moyenne du secteur",
          "Aucune",
        ];
      case "Segmentation":
        return ["Par trimestre", "Par mois", "Par catégorie", "Par région"];
      case "Indicateurs":
        return [
          "Revenus",
          "Croissance",
          "Rentabilité",
          "Satisfaction client",
          "Tous les indicateurs",
        ];
      case "Tri":
        return ["Par revenus", "Par croissance", "Par rentabilité", "Par date"];
      default:
        return ["Option 1", "Option 2", "Option 3"];
    }
  };

  // Gestionnaire pour le clic sur un filtre
  const handleFilterClick = () => {
    // Préparer les options de filtre basées sur le rapport sélectionné
    if (selectedReport) {
      const filterOptions: FilterOption[] = selectedReport.filters.map(
        (filter) => ({
          id: filter.name.toLowerCase().replace(/\s+/g, "-"),
          name: filter.name,
          options: getFilterOptions(filter.name),
          currentValue: filter.value,
        })
      );
      setActiveFilters(filterOptions);
      setFilterDialogOpen(true);
    }
  };

  // Gestionnaire pour le changement de filtre
  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, currentValue: value } : filter
      )
    );
  };

  // Gestionnaire pour l'application des filtres
  const handleApplyFilters = () => {
    if (selectedReport) {
      // Mettre à jour les filtres du rapport sélectionné
      const updatedReport = {
        ...selectedReport,
        filters: activeFilters.map((filter) => ({
          name: filter.name,
          value: filter.currentValue,
        })),
      };

      setSelectedReport(updatedReport);

      // Mettre à jour la liste des rapports pour refléter les changements
      setReports((prev) =>
        prev.map((report) =>
          report.id === selectedReport.id ? updatedReport : report
        )
      );

      setFilterDialogOpen(false);

      // Simuler un chargement pour montrer que les filtres sont appliqués
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Gestionnaire pour le changement d'année
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapport annuel</h1>
          <p className="text-muted-foreground">
            Analysez les performances annuelles de votre entreprise
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        {selectedReport ? (
          <AnalyticsReportCard
            title={`${selectedReport.title} - ${selectedYear}`}
            description={selectedReport.description}
            lastUpdated={selectedReport.lastUpdated}
            period={`Annuel - ${selectedYear}`}
            filters={selectedReport.filters}
            exportFormats={selectedReport.exportFormats}
            isLoading={isLoading}
            onExport={(format) => handleExport(format, selectedReport.id)}
            onShare={() => handleShare(selectedReport.id)}
            onRefresh={() => handleRefresh(selectedReport.id)}
            onFilterClick={handleFilterClick}
          >
            <AnalyticsReportContent reportData={selectedReport} />
          </AnalyticsReportCard>
        ) : (
          <Card className="h-[500px] flex items-center justify-center">
            <CardContent>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Aucun rapport disponible pour l&apos;année {selectedYear}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedYear("2023")}
                >
                  Voir les rapports de 2023
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer hover:border-primary transition-colors ${
                  selectedReport?.id === report.id ? "border-primary" : ""
                }`}
                onClick={() => handleReportSelect(report)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="text-xs truncate">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Catégorie: {report.category}</span>
                    <span>Type: {report.type}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Boîte de dialogue des filtres */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
