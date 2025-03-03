"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Save } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
 * Page des rapports personnalisés
 */
export default function CustomReportsPage() {
  // État pour stocker les rapports
  const [reports, setReports] = useState<ReportData[]>([]);

  // État pour stocker le rapport sélectionné
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // État pour le mode d'édition
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // État pour les filtres personnalisés
  const [customFilters, setCustomFilters] = useState({
    dateDebut: "",
    dateFin: "",
    categories: ["financial", "performance"],
    types: ["chart", "table"],
    inclureArchives: false,
  });

  // État pour le chargement
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // État pour la boîte de dialogue des filtres
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  // Effet pour charger les rapports
  useEffect(() => {
    setIsLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      // Récupérer tous les rapports
      const allReports = [
        ...getReportsByCategory("financial"),
        ...getReportsByCategory("performance"),
        ...getReportsByCategory("user"),
        ...getReportsByCategory("provider"),
      ];

      // Filtrer les rapports selon les filtres personnalisés
      const filteredReports = allReports.filter(
        (report) =>
          customFilters.categories.includes(report.category) &&
          customFilters.types.includes(report.type)
      );

      setReports(filteredReports);

      // Sélectionner le premier rapport par défaut
      if (filteredReports.length > 0 && !selectedReport) {
        setSelectedReport(filteredReports[0]);
      } else if (filteredReports.length === 0) {
        setSelectedReport(null);
      }

      setIsLoading(false);
    }, 500);
  }, [customFilters, selectedReport]);

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
          "Personnalisé",
          "7 derniers jours",
          "30 derniers jours",
          "90 derniers jours",
          "12 derniers mois",
        ];
      case "Comparaison":
        return [
          "Période précédente",
          "Même période année précédente",
          "Objectifs",
          "Moyenne du secteur",
          "Aucune",
        ];
      case "Segmentation":
        return [
          "Par jour",
          "Par semaine",
          "Par mois",
          "Par catégorie",
          "Par région",
          "Par source",
        ];
      case "Indicateurs":
        return [
          "Tous les indicateurs",
          "Revenus",
          "Réservations",
          "Satisfaction",
          "Conversion",
          "Rétention",
        ];
      case "Tri":
        return [
          "Par date",
          "Par revenus",
          "Par réservations",
          "Par satisfaction",
          "Par pertinence",
        ];
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

  // Gestionnaire pour le changement de catégorie
  const handleCategoryChange = (category: string) => {
    setCustomFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  // Gestionnaire pour le changement de type
  const handleTypeChange = (type: string) => {
    setCustomFilters((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  // Gestionnaire pour le changement d'inclusion des archives
  const handleArchiveChange = (checked: boolean) => {
    setCustomFilters((prev) => ({ ...prev, inclureArchives: checked }));
  };

  // Gestionnaire pour la sauvegarde des filtres
  const handleSaveFilters = () => {
    console.log("Filtres sauvegardés:", customFilters);
    // Logique de sauvegarde à implémenter
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Rapport personnalisé
          </h1>
          <p className="text-muted-foreground">
            Créez et consultez des rapports personnalisés selon vos besoins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditMode ? "Voir le rapport" : "Personnaliser"}
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="view" value={isEditMode ? "edit" : "view"}>
        <TabsContent value="view" className="space-y-6">
          {selectedReport ? (
            <AnalyticsReportCard
              title={`${selectedReport.title} (Personnalisé)`}
              description={selectedReport.description}
              lastUpdated={selectedReport.lastUpdated}
              period="Personnalisé"
              filters={[
                ...selectedReport.filters,
                ...(customFilters.dateDebut
                  ? [{ name: "Date début", value: customFilters.dateDebut }]
                  : []),
                ...(customFilters.dateFin
                  ? [{ name: "Date fin", value: customFilters.dateFin }]
                  : []),
              ]}
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
                    Aucun rapport disponible avec les filtres sélectionnés
                  </p>
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    Personnaliser les filtres
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
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnaliser les filtres</CardTitle>
              <CardDescription>
                Définissez les critères pour votre rapport personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Période</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="dateDebut" className="text-xs">
                        Date de début
                      </Label>
                      <Input
                        id="dateDebut"
                        type="date"
                        value={customFilters.dateDebut}
                        onChange={(e) =>
                          setCustomFilters((prev) => ({
                            ...prev,
                            dateDebut: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="dateFin" className="text-xs">
                        Date de fin
                      </Label>
                      <Input
                        id="dateFin"
                        type="date"
                        value={customFilters.dateFin}
                        onChange={(e) =>
                          setCustomFilters((prev) => ({
                            ...prev,
                            dateFin: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="archives"
                      checked={customFilters.inclureArchives}
                      onCheckedChange={handleArchiveChange}
                    />
                    <Label htmlFor="archives" className="text-sm">
                      Inclure les rapports archivés
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catégories</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "financial",
                    "performance",
                    "user",
                    "provider",
                    "marketing",
                  ].map((category) => (
                    <Button
                      key={category}
                      variant={
                        customFilters.categories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Types de rapport</Label>
                <div className="flex flex-wrap gap-2">
                  {["chart", "table", "summary", "mixed"].map((type) => (
                    <Button
                      key={type}
                      variant={
                        customFilters.types.includes(type)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeChange(type)}
                    >
                      {type === "chart"
                        ? "Graphique"
                        : type === "table"
                        ? "Tableau"
                        : type === "summary"
                        ? "Résumé"
                        : "Mixte"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveFilters}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button onClick={() => setIsEditMode(false)}>Appliquer</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

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
