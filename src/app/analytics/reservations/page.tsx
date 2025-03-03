"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";

// Import des composants d'analyse
import AdvancedAnalyticsFilters from "@/components/_organisms/AdvancedAnalyticsFilters/AdvancedAnalyticsFilters";
import AdvancedAnalyticsChart from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import AnalyticsKPICards from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";
import AnalyticsDataTable from "@/components/_organisms/AnalyticsDataTable/AnalyticsDataTable";
import MetricsComparison from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  AnalyticsFilterState,
  FilterPeriod,
  AnalyticsFilter,
} from "@/components/_organisms/AdvancedAnalyticsFilters/AdvancedAnalyticsFilters";
import { VisualizationOptions } from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { KPI } from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";

// Import des mocks pour l'analyse des réservations
import {
  reservationKPIs,
  reservationsTimeSeriesData,
  categoryDistributionData,
  locationDistributionData,
  hourlyReservationsData,
  monthlyReservationsData,
  cityReservationsData,
  groupSizeReservationsData,
  priceRangeReservationsData,
  cancellationReasonsData,
  weekdayComparisonData,
  reservationsTableData,
  providerPerformanceData,
  monthlyTrendData,
} from "@/mocks/analyticsReservationsMocks";

// Options de visualisation par défaut
const defaultVisualizationOptions: VisualizationOptions = {
  chartType: "line",
  stacked: false,
  showDots: true,
  showGrid: true,
  colors: ["#3b82f6", "#ef4444", "#10b981"],
  unit: "",
  numberFormat: "standard",
};

/**
 * Page d'analyse des réservations
 */
const ReservationsAnalyticsPage: React.FC = () => {
  // État pour les filtres
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    search: "",
    period: "last30days" as FilterPeriod,
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    activeFilters: [] as AnalyticsFilter[],
    timeGranularity: "day",
    compareWithPrevious: false,
    sortBy: "date",
    sortDirection: "desc",
  });

  // État pour les options de visualisation
  const [visualizationOptions, setVisualizationOptions] =
    useState<VisualizationOptions>(defaultVisualizationOptions);

  // État pour les données filtrées
  const [filteredData, setFilteredData] = useState({
    timeSeriesData: reservationsTimeSeriesData,
    categoryData: categoryDistributionData,
    locationData: locationDistributionData,
    hourlyData: hourlyReservationsData,
    monthlyData: monthlyReservationsData,
    cityData: cityReservationsData,
    groupSizeData: groupSizeReservationsData,
    priceRangeData: priceRangeReservationsData,
    cancellationData: cancellationReasonsData,
    weekdayData: weekdayComparisonData,
    tableData: reservationsTableData,
    providerData: providerPerformanceData,
    trendData: monthlyTrendData,
  });

  // État pour les KPIs
  const [displayedKPIs, setDisplayedKPIs] = useState(reservationKPIs);

  // Gestionnaire de changement de filtres
  const handleFiltersChange = (newFilters: AnalyticsFilterState) => {
    console.log("Nouveaux filtres reçus:", newFilters);
    setFilters(newFilters);

    // Appliquer directement les filtres ici au lieu d'attendre l'effet
    applyFilters(newFilters);
  };

  // Fonction pour appliquer les filtres aux données
  const applyFilters = useCallback(
    (currentFilters: AnalyticsFilterState) => {
      // Dans une application réelle, vous feriez une requête API avec les filtres
      // Pour cette démo, nous allons simuler un filtrage sur les données existantes
      console.log("Début de l'application des filtres:", currentFilters);

      // Exemple de filtrage simple basé sur la recherche
      const searchTerm = currentFilters.search.toLowerCase();

      // Filtrer les données du tableau
      let filteredTableData = { ...reservationsTableData };
      if (searchTerm) {
        filteredTableData = {
          ...reservationsTableData,
          data: reservationsTableData.data.filter(
            (item) =>
              item.activity.toLowerCase().includes(searchTerm) ||
              item.category.toLowerCase().includes(searchTerm) ||
              item.provider.toLowerCase().includes(searchTerm) ||
              item.location.toLowerCase().includes(searchTerm) ||
              item.status.toLowerCase().includes(searchTerm)
          ),
        };
      }

      // Mettre à jour les données filtrées
      setFilteredData({
        ...filteredData,
        tableData: filteredTableData,
      });

      // Mettre à jour les KPIs en fonction des filtres
      // Exemple simple: ajuster les KPIs en fonction du nombre de réservations filtrées
      const filteredCount = filteredTableData.data.length;
      const ratio = filteredCount / reservationsTableData.data.length;

      const updatedKPIs = reservationKPIs.map((kpi) => ({
        ...kpi,
        value:
          typeof kpi.value === "number"
            ? Math.round(kpi.value * ratio)
            : kpi.value,
      }));

      setDisplayedKPIs(updatedKPIs);

      console.log("Filtres appliqués, données mises à jour");
    },
    [filteredData]
  );

  // Gestionnaire de changement d'options de visualisation
  const handleVisualizationOptionsChange = (
    newOptions: Partial<VisualizationOptions>
  ) => {
    setVisualizationOptions({ ...visualizationOptions, ...newOptions });
  };

  // Gestionnaire de clic sur une carte KPI
  const handleKPIClick = (kpi: KPI) => {
    console.log("KPI cliqué:", kpi.id);

    // Exemple: filtrer par catégorie si on clique sur un KPI spécifique
    if (kpi.id === "total-reservations") {
      // Réinitialiser les filtres
      const newFilters = {
        ...filters,
        activeFilters: [],
      };
      setFilters(newFilters);
      applyFilters(newFilters);
    }
  };

  // Appliquer les filtres initiaux au chargement
  useEffect(() => {
    console.log("Chargement initial, application des filtres par défaut");
    applyFilters(filters);
  }, [applyFilters, filters]);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analyse des réservations
          </h1>
          <p className="text-muted-foreground">
            Explorez et analysez les données de réservations sur votre
            plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>Rapport</span>
          </Button>
        </div>
      </div>

      <AdvancedAnalyticsFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        filterOptions={[
          {
            id: "category",
            label: "Catégorie",
            options: [
              { value: "Sport", label: "Sport" },
              { value: "Culture", label: "Culture" },
              { value: "Bien-être", label: "Bien-être" },
              { value: "Gastronomie", label: "Gastronomie" },
              { value: "Aventure", label: "Aventure" },
              { value: "Divertissement", label: "Divertissement" },
              { value: "Art", label: "Art" },
            ],
          },
          {
            id: "status",
            label: "Statut",
            options: [
              { value: "Complétée", label: "Complétée" },
              { value: "En attente", label: "En attente" },
              { value: "Annulée", label: "Annulée" },
            ],
          },
          {
            id: "provider",
            label: "Prestataire",
            options: [
              { value: "Zen Studio", label: "Zen Studio" },
              { value: "Cave du Sommelier", label: "Cave du Sommelier" },
              { value: "Vertical Climb", label: "Vertical Climb" },
              {
                value: "Musée d&apos;Art Moderne",
                label: "Musée d&apos;Art Moderne",
              },
              { value: "Atelier des Chefs", label: "Atelier des Chefs" },
              { value: "Mystery Room", label: "Mystery Room" },
              { value: "Ocean Ride", label: "Ocean Ride" },
              { value: "Créa Studio", label: "Créa Studio" },
              { value: "Oasis Spa", label: "Oasis Spa" },
              { value: "Nature Trek", label: "Nature Trek" },
            ],
          },
          {
            id: "location",
            label: "Lieu",
            options: [
              { value: "Paris", label: "Paris" },
              { value: "Lyon", label: "Lyon" },
              { value: "Marseille", label: "Marseille" },
              { value: "Bordeaux", label: "Bordeaux" },
              { value: "Lille", label: "Lille" },
            ],
          },
        ]}
      />

      <div>
        <AnalyticsKPICards kpis={displayedKPIs} onKPIClick={handleKPIClick} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des réservations</CardTitle>
          <CardDescription>
            Visualisation de l&apos;évolution des réservations et annulations au
            fil du temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedAnalyticsChart
            data={filteredData.timeSeriesData}
            series={[
              { key: "Réservations", name: "Réservations" },
              { key: "Annulations", name: "Annulations" },
            ]}
            options={visualizationOptions}
            onOptionsChange={handleVisualizationOptionsChange}
            title=""
            description=""
            hideHeader={true}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>
              Distribution des réservations par catégorie d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedAnalyticsChart
              data={filteredData.categoryData}
              options={{
                ...visualizationOptions,
                chartType: "pie",
              }}
              onOptionsChange={handleVisualizationOptionsChange}
              title=""
              description=""
              hideHeader={true}
            />
          </CardContent>
        </Card>

        <MetricsComparison
          data={filteredData.weekdayData}
          visualizationType="bars"
        />
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="details" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Détails des réservations</span>
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Analyse temporelle</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Analyse géographique</span>
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>Segments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails des réservations</CardTitle>
              <CardDescription>
                Liste détaillée des réservations récentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDataTable
                columns={filteredData.tableData.columns}
                data={filteredData.tableData.data}
                title="Détails des réservations"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Réservations par heure</CardTitle>
                <CardDescription>
                  Distribution des réservations selon l&apos;heure de la journée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.hourlyData}
                  series={[{ key: "Réservations", name: "Réservations" }]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réservations par mois</CardTitle>
                <CardDescription>
                  Distribution des réservations selon les mois de l&apos;année
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.monthlyData}
                  series={[{ key: "Réservations", name: "Réservations" }]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendance mensuelle</CardTitle>
              <CardDescription>
                Évolution des réservations et revenus sur les 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAnalyticsChart
                data={filteredData.trendData}
                series={[
                  { key: "Réservations", name: "Réservations" },
                  { key: "Revenus", name: "Revenus" },
                ]}
                options={{
                  ...visualizationOptions,
                  chartType: "line",
                }}
                onOptionsChange={handleVisualizationOptionsChange}
                title=""
                description=""
                hideHeader={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Réservations par ville</CardTitle>
                <CardDescription>
                  Distribution des réservations selon les villes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.cityData}
                  series={[{ key: "Réservations", name: "Réservations" }]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par lieu</CardTitle>
                <CardDescription>
                  Distribution des réservations selon les lieux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.locationData}
                  options={{
                    ...visualizationOptions,
                    chartType: "pie",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Réservations par taille de groupe</CardTitle>
                <CardDescription>
                  Distribution des réservations selon le nombre de participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.groupSizeData}
                  series={[{ key: "Réservations", name: "Réservations" }]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réservations par gamme de prix</CardTitle>
                <CardDescription>
                  Distribution des réservations selon le prix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.priceRangeData}
                  series={[{ key: "Réservations", name: "Réservations" }]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Raisons d&apos;annulation</CardTitle>
                <CardDescription>
                  Distribution des annulations selon les raisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.cancellationData}
                  options={{
                    ...visualizationOptions,
                    chartType: "pie",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance des prestataires</CardTitle>
                <CardDescription>
                  Comparaison des performances des prestataires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  data={filteredData.providerData}
                  series={[
                    { key: "Réservations", name: "Réservations" },
                    { key: "Revenus", name: "Revenus" },
                  ]}
                  options={{
                    ...visualizationOptions,
                    chartType: "bar",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  title=""
                  description=""
                  hideHeader={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsAnalyticsPage;
