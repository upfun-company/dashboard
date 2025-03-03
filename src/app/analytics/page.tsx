"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  FileText,
  BarChart3,
  PieChart,
  Table2,
  ArrowRightLeft,
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
} from "@/components/_organisms/AdvancedAnalyticsFilters/AdvancedAnalyticsFilters";
import { VisualizationOptions } from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";

// Types pour les composants d'analyse
interface KPI {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  previousValue?: number | string;
  unit?: string;
  format?: "standard" | "compact" | "currency" | "percent";
  icon?:
    | "users"
    | "calendar"
    | "money"
    | "percent"
    | "clock"
    | "cart"
    | "award"
    | "star";
  color?: "default" | "blue" | "green" | "amber" | "red" | "purple" | "pink";
  info?: string;
}

// Données de démonstration pour les KPIs
const demoKPIs: KPI[] = [
  {
    id: "total-reservations",
    title: "Réservations totales",
    value: 1245,
    change: 12.5,
    previousValue: 1106,
    unit: "",
    format: "standard",
    icon: "calendar",
    color: "blue",
    info: "Nombre total de réservations sur la période",
  },
  {
    id: "active-users",
    title: "Utilisateurs actifs",
    value: 8750,
    change: 5.2,
    previousValue: 8317,
    unit: "",
    format: "compact",
    icon: "users",
    color: "green",
    info: "Nombre d'utilisateurs actifs sur la période",
  },
  {
    id: "total-revenue",
    title: "Chiffre d'affaires",
    value: 89750,
    change: 15.2,
    previousValue: 77910,
    unit: "€",
    format: "currency",
    icon: "money",
    color: "amber",
    info: "Chiffre d'affaires total sur la période",
  },
];

// Données de démonstration pour les séries temporelles
const demoTimeSeriesData = {
  title: "Évolution des réservations",
  description: "Nombre de réservations sur la période sélectionnée",
  data: [
    { label: "2023-01", "Période actuelle": 120, "Période précédente": 100 },
    { label: "2023-02", "Période actuelle": 150, "Période précédente": 130 },
    { label: "2023-03", "Période actuelle": 180, "Période précédente": 140 },
    { label: "2023-04", "Période actuelle": 220, "Période précédente": 190 },
    { label: "2023-05", "Période actuelle": 270, "Période précédente": 230 },
    { label: "2023-06", "Période actuelle": 250, "Période précédente": 210 },
  ],
  series: [
    { key: "Période actuelle", name: "Période actuelle" },
    { key: "Période précédente", name: "Période précédente" },
  ],
};

// Données de démonstration pour la comparaison de métriques
const demoComparisonData = {
  title: "Comparaison des métriques clés",
  description: "Comparaison des performances entre les périodes",
  currentPeriod: "Derniers 30 jours",
  previousPeriod: "30 jours précédents",
  metrics: [
    {
      id: "reservations",
      name: "Réservations",
      currentValue: 1245,
      previousValue: 1106,
      changePercentage: 12.5,
      target: 1300,
      format: "standard",
      color: "#3b82f6",
    },
    {
      id: "conversion-rate",
      name: "Taux de conversion",
      currentValue: 3.8,
      previousValue: 3.9,
      changePercentage: -0.5,
      target: 4.0,
      format: "percent",
      color: "#10b981",
    },
    {
      id: "total-revenue",
      name: "Chiffre d'affaires",
      currentValue: 89750,
      previousValue: 77910,
      changePercentage: 15.2,
      target: 90000,
      format: "currency",
      color: "#f59e0b",
    },
    {
      id: "avg-booking-value",
      name: "Valeur moyenne",
      currentValue: 72.1,
      previousValue: 70.5,
      changePercentage: 2.3,
      target: 75.0,
      format: "currency",
      color: "#8b5cf6",
    },
  ],
};

// Données de démonstration pour le tableau
interface TableDataItem {
  id: string;
  category: string;
  subcategory: string;
  reservations: number;
  revenue: number;
  avgValue: number;
  conversionRate: number;
  growth: number;
  status?: string;
  provider?: string;
  location?: string;
  activity?: string;
}

interface AnalyticsColumn<T> {
  id: string;
  header: string;
  accessorFn: (row: T) => string | number | boolean | null | undefined;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  format?: "standard" | "compact" | "currency" | "percent";
}

const demoTableData = {
  columns: [
    {
      id: "category",
      header: "Catégorie",
      accessorFn: (row: TableDataItem) => row.category,
      sortable: true,
      filterable: true,
    },
    {
      id: "subcategory",
      header: "Sous-catégorie",
      accessorFn: (row: TableDataItem) => row.subcategory,
      sortable: true,
      filterable: true,
    },
    {
      id: "reservations",
      header: "Réservations",
      accessorFn: (row: TableDataItem) => row.reservations,
      sortable: true,
      align: "right",
    },
    {
      id: "revenue",
      header: "Revenus",
      accessorFn: (row: TableDataItem) => row.revenue,
      sortable: true,
      align: "right",
      format: "currency",
    },
    {
      id: "avgValue",
      header: "Valeur moyenne",
      accessorFn: (row: TableDataItem) => row.avgValue,
      sortable: true,
      align: "right",
      format: "currency",
    },
    {
      id: "conversionRate",
      header: "Taux de conversion",
      accessorFn: (row: TableDataItem) => row.conversionRate,
      sortable: true,
      align: "right",
      format: "percent",
    },
    {
      id: "growth",
      header: "Croissance",
      accessorFn: (row: TableDataItem) => row.growth,
      sortable: true,
      align: "right",
      format: "percent",
    },
  ] as AnalyticsColumn<TableDataItem>[],
  data: [
    {
      id: "1",
      category: "Sport",
      subcategory: "Escalade",
      reservations: 245,
      revenue: 12250,
      avgValue: 50,
      conversionRate: 8.5,
      growth: 12.3,
    },
    {
      id: "2",
      category: "Sport",
      subcategory: "Fitness",
      reservations: 180,
      revenue: 9000,
      avgValue: 50,
      conversionRate: 7.2,
      growth: 8.5,
    },
    {
      id: "3",
      category: "Culture",
      subcategory: "Musées",
      reservations: 210,
      revenue: 8400,
      avgValue: 40,
      conversionRate: 9.5,
      growth: 5.2,
    },
    {
      id: "4",
      category: "Culture",
      subcategory: "Théâtre",
      reservations: 150,
      revenue: 9750,
      avgValue: 65,
      conversionRate: 6.8,
      growth: 3.7,
    },
    {
      id: "5",
      category: "Bien-être",
      subcategory: "Spa",
      reservations: 120,
      revenue: 10800,
      avgValue: 90,
      conversionRate: 5.4,
      growth: 15.8,
    },
  ],
};

// Données pour les graphiques en camembert
const demoCategoryPieData = [
  { name: "Sport", value: 350, color: "#3b82f6" },
  { name: "Culture", value: 275, color: "#10b981" },
  { name: "Bien-être", value: 180, color: "#f59e0b" },
  { name: "Gastronomie", value: 220, color: "#8b5cf6" },
  { name: "Divertissement", value: 120, color: "#ec4899" },
  { name: "Autres", value: 100, color: "#94a3b8" },
];

const demoLocationPieData = [
  { name: "Paris", value: 450, color: "#3b82f6" },
  { name: "Lyon", value: 200, color: "#10b981" },
  { name: "Marseille", value: 180, color: "#f59e0b" },
  { name: "Bordeaux", value: 150, color: "#8b5cf6" },
  { name: "Lille", value: 120, color: "#ec4899" },
  { name: "Autres", value: 145, color: "#94a3b8" },
];

// Données pour les performances des prestataires
const demoProviderPerformanceData = [
  { label: "Prestataire A", Réservations: 120, Revenus: 9500 },
  { label: "Prestataire B", Réservations: 95, Revenus: 8200 },
  { label: "Prestataire C", Réservations: 85, Revenus: 7800 },
  { label: "Prestataire D", Réservations: 70, Revenus: 5600 },
  { label: "Prestataire E", Réservations: 65, Revenus: 4900 },
];

// Données pour la tendance mensuelle
const demoMonthlyTrendData = [
  { label: "Jan", Réservations: 120, "Revenus (k€)": 9.6 },
  { label: "Fév", Réservations: 150, "Revenus (k€)": 12 },
  { label: "Mar", Réservations: 180, "Revenus (k€)": 14.4 },
  { label: "Avr", Réservations: 220, "Revenus (k€)": 17.6 },
  { label: "Mai", Réservations: 270, "Revenus (k€)": 21.6 },
  { label: "Juin", Réservations: 250, "Revenus (k€)": 20 },
];

// Définir les options de visualisation par défaut
const defaultVisualizationOptions: VisualizationOptions = {
  chartType: "line",
  stacked: false,
  showDots: true,
  showGrid: true,
  colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  unit: "",
  numberFormat: "standard",
};

// Composant principal
const AnalyticsPage: React.FC = () => {
  // État pour les filtres
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    search: "",
    period: "last30days" as FilterPeriod,
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date(),
    },
    activeFilters: [],
    timeGranularity: "day",
    compareWithPrevious: true,
    sortBy: "date",
    sortDirection: "desc",
  });

  // État pour les options de visualisation
  const [visualizationOptions, setVisualizationOptions] =
    useState<VisualizationOptions>(defaultVisualizationOptions);

  // État pour les données filtrées - utiliser useMemo pour éviter les recalculs inutiles
  const [filteredData, setFilteredData] = useState({
    kpis: demoKPIs,
    timeSeriesData: demoTimeSeriesData,
    comparisonData: demoComparisonData,
    tableData: demoTableData,
    pieChartData: demoCategoryPieData,
    locationPieData: demoLocationPieData,
    providerData: demoProviderPerformanceData,
    trendData: demoMonthlyTrendData,
  });

  // État pour les KPIs
  const [displayedKPIs, setDisplayedKPIs] = useState(demoKPIs);

  // Fonction pour appliquer les filtres aux données - stable avec useCallback
  const applyFilters = useCallback((currentFilters: AnalyticsFilterState) => {
    console.log("Début de l'application des filtres:", currentFilters);

    // Exemple de filtrage simple basé sur la recherche
    const searchTerm = currentFilters.search.toLowerCase();

    // Filtrer les données du tableau
    let filteredTableData = { ...demoTableData };
    if (searchTerm) {
      filteredTableData = {
        ...demoTableData,
        data: demoTableData.data.filter(
          (item) =>
            item.category.toLowerCase().includes(searchTerm) ||
            item.subcategory.toLowerCase().includes(searchTerm)
        ),
      };
    }

    // Appliquer les filtres actifs
    if (currentFilters.activeFilters.length > 0) {
      filteredTableData = {
        ...filteredTableData,
        data: filteredTableData.data.filter((item) => {
          return currentFilters.activeFilters.every((filter) => {
            switch (filter.type) {
              case "category":
                return item.category === filter.value;
              default:
                return true;
            }
          });
        }),
      };
    }

    // Mettre à jour les données filtrées
    setFilteredData({
      kpis: demoKPIs,
      timeSeriesData: demoTimeSeriesData,
      comparisonData: demoComparisonData,
      tableData: filteredTableData,
      pieChartData: demoCategoryPieData,
      locationPieData: demoLocationPieData,
      providerData: demoProviderPerformanceData,
      trendData: demoMonthlyTrendData,
    });

    // Mettre à jour les KPIs en fonction des filtres
    const filteredReservations = filteredTableData.data.length;
    const filteredRevenue = filteredTableData.data.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const filteredAvgValue =
      filteredReservations > 0 ? filteredRevenue / filteredReservations : 0;

    const updatedKPIs = [...demoKPIs];
    updatedKPIs[0].value = filteredReservations;
    updatedKPIs[1].value = filteredRevenue;
    updatedKPIs[2].value = filteredAvgValue;

    setDisplayedKPIs(updatedKPIs);

    console.log("Filtres appliqués, données mises à jour");
  }, []);

  // Gestionnaire d'événements pour les changements de filtres - stable avec useCallback
  const handleFiltersChange = useCallback(
    (newFilters: AnalyticsFilterState) => {
      console.log("Nouveaux filtres reçus:", newFilters);
      setFilters(newFilters);
      applyFilters(newFilters);
    },
    [applyFilters]
  );

  const handleVisualizationOptionsChange = useCallback(
    (newOptions: VisualizationOptions) => {
      setVisualizationOptions(newOptions);
    },
    []
  );

  const handleKPIClick = useCallback(
    (kpi: KPI) => {
      console.log("KPI clicked:", kpi.id);

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
    },
    [filters, applyFilters]
  );

  // Appliquer les filtres initiaux au chargement - une seule fois
  useEffect(() => {
    console.log("Chargement initial, application des filtres par défaut");
    applyFilters(filters);
  }, []); // Dépendance vide = exécution unique au montage

  // Mémoriser les options de filtre pour éviter les re-rendus inutiles
  const filterOptions = useMemo(
    () => [
      {
        id: "category",
        label: "Catégorie",
        options: [
          { value: "Sport", label: "Sport" },
          { value: "Culture", label: "Culture" },
          { value: "Bien-être", label: "Bien-être" },
          { value: "Gastronomie", label: "Gastronomie" },
          { value: "Divertissement", label: "Divertissement" },
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
    ],
    []
  );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse</h1>
          <p className="text-muted-foreground">
            Visualisez et analysez les performances de votre plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Générer un rapport
          </Button>
        </div>
      </div>

      <AdvancedAnalyticsFilters
        initialFilters={filters}
        filterOptions={filterOptions}
        onFiltersChange={handleFiltersChange}
      />

      <div>
        <AnalyticsKPICards kpis={displayedKPIs} onKPIClick={handleKPIClick} />
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts">
            <BarChart3 className="h-4 w-4 mr-2" />
            Graphiques
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <PieChart className="h-4 w-4 mr-2" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="data">
            <Table2 className="h-4 w-4 mr-2" />
            Données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des réservations</CardTitle>
              <CardDescription>
                Nombre de réservations sur la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAnalyticsChart
                title={filteredData.timeSeriesData.title}
                description={filteredData.timeSeriesData.description}
                data={filteredData.timeSeriesData.data}
                series={filteredData.timeSeriesData.series}
                options={visualizationOptions}
                onOptionsChange={handleVisualizationOptionsChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <MetricsComparison
            data={{
              title: filteredData.comparisonData.title,
              description: filteredData.comparisonData.description,
              currentPeriod: filteredData.comparisonData.currentPeriod,
              previousPeriod: filteredData.comparisonData.previousPeriod,
              metrics: filteredData.comparisonData.metrics.map((metric) => ({
                ...metric,
                format: metric.format as
                  | "standard"
                  | "compact"
                  | "currency"
                  | "percent",
              })),
            }}
            visualizationType="bars"
          />
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>
                  Distribution des réservations par catégorie d&apos;activité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  title=""
                  data={filteredData.pieChartData}
                  options={{
                    ...visualizationOptions,
                    chartType: "pie",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  hideHeader={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par lieu</CardTitle>
                <CardDescription>
                  Distribution des réservations par ville
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedAnalyticsChart
                  title=""
                  data={filteredData.locationPieData}
                  options={{
                    ...visualizationOptions,
                    chartType: "pie",
                  }}
                  onOptionsChange={handleVisualizationOptionsChange}
                  hideHeader={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données détaillées</CardTitle>
              <CardDescription>
                Analyse détaillée par catégorie et sous-catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDataTable
                data={filteredData.tableData.data}
                columns={filteredData.tableData.columns}
                pageSize={10}
                currentPage={1}
                totalPages={1}
                totalItems={filteredData.tableData.data.length}
                title="Données détaillées"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance des prestataires</CardTitle>
            <CardDescription>
              Comparaison des performances des principaux prestataires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedAnalyticsChart
              title=""
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
              hideHeader={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendance mensuelle</CardTitle>
            <CardDescription>
              Évolution des réservations et revenus par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedAnalyticsChart
              title=""
              data={filteredData.trendData}
              series={[
                { key: "Réservations", name: "Réservations" },
                { key: "Revenus (k€)", name: "Revenus (k€)" },
              ]}
              options={{
                ...visualizationOptions,
                chartType: "line",
              }}
              onOptionsChange={handleVisualizationOptionsChange}
              hideHeader={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
