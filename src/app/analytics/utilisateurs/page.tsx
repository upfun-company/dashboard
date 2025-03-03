"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import AnalyticsKPICards from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";
import AdvancedAnalyticsChart from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import AdvancedAnalyticsFilters, {
  FilterPeriod,
} from "@/components/_organisms/AdvancedAnalyticsFilters/AdvancedAnalyticsFilters";
import AnalyticsDataTable from "@/components/_organisms/AnalyticsDataTable/AnalyticsDataTable";
import MetricsComparison from "@/components/_organisms/MetricsComparison/MetricsComparison";

import {
  userKPIs,
  usersTimeSeriesData,
  ageDistributionData,
  locationDistributionData,
  bookingFrequencyData,
  spendingDistributionData,
  userCohortsData,
  usersTableData,
  userPreferredCategoriesData,
  avgSpendingTrendData,
} from "@/mocks/analyticsUsersMocks";

/**
 * Page d'analyse des utilisateurs
 * Affiche des KPIs, graphiques et tableaux pour l'analyse des utilisateurs
 */
export default function UsersAnalyticsPage() {
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<string>(
    searchParams.get("period") || "this-month"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [location, setLocation] = useState<string>(
    searchParams.get("location") || "all"
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || "all"
  );

  // Données filtrées pour les KPIs
  const [filteredKPIs, setFilteredKPIs] = useState(userKPIs);
  const [filteredTimeSeriesData, setFilteredTimeSeriesData] =
    useState(usersTimeSeriesData);
  const [filteredTableData, setFilteredTableData] = useState(
    usersTableData.data
  );

  // Options pour les filtres
  const periodOptions = [
    { value: "today", label: "Aujourd&apos;hui" },
    { value: "yesterday", label: "Hier" },
    { value: "this-week", label: "Cette semaine" },
    { value: "last-week", label: "Semaine dernière" },
    { value: "this-month", label: "Ce mois" },
    { value: "last-month", label: "Mois dernier" },
    { value: "this-year", label: "Cette année" },
    { value: "last-year", label: "Année dernière" },
    { value: "all-time", label: "Tout" },
  ];

  const categoryOptions = [
    { value: "all", label: "Toutes catégories" },
    { value: "sport", label: "Sport" },
    { value: "culture", label: "Culture" },
    { value: "bien-etre", label: "Bien-être" },
    { value: "gastronomie", label: "Gastronomie" },
    { value: "divertissement", label: "Divertissement" },
  ];

  const locationOptions = [
    { value: "all", label: "Toutes localisations" },
    { value: "paris", label: "Paris" },
    { value: "lyon", label: "Lyon" },
    { value: "marseille", label: "Marseille" },
    { value: "bordeaux", label: "Bordeaux" },
    { value: "lille", label: "Lille" },
  ];

  const statusOptions = [
    { value: "all", label: "Tous statuts" },
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
    { value: "new", label: "Nouveau" },
  ];

  // Appliquer les filtres
  useEffect(() => {
    console.log("Applying filters:", { period, category, location, status });

    // Simuler l'application des filtres
    let periodFactor = 1.0;
    switch (period) {
      case "today":
        periodFactor = 0.7;
        break;
      case "yesterday":
        periodFactor = 0.75;
        break;
      case "this-week":
        periodFactor = 0.8;
        break;
      case "last-week":
        periodFactor = 0.85;
        break;
      case "this-month":
        periodFactor = 0.9;
        break;
      case "last-month":
        periodFactor = 0.95;
        break;
      case "this-year":
        periodFactor = 1.0;
        break;
      case "last-year":
        periodFactor = 0.9;
        break;
      case "all-time":
        periodFactor = 1.0;
        break;
      default:
        periodFactor = 1.0;
    }

    // Appliquer les facteurs aux KPIs
    const updatedKPIs = userKPIs.map((kpi) => {
      const ratio = periodFactor;
      // Assurer que les valeurs sont des nombres
      const value = typeof kpi.value === "number" ? kpi.value : 0;
      const previousValue =
        typeof kpi.previousValue === "number" ? kpi.previousValue : 0;

      const newValue = Math.round(value * ratio);
      const newPreviousValue = Math.round(previousValue * ratio);
      const newChange =
        newPreviousValue > 0
          ? ((newValue - newPreviousValue) / newPreviousValue) * 100
          : 0;

      return {
        ...kpi,
        value: newValue,
        previousValue: newPreviousValue,
        change: parseFloat(newChange.toFixed(1)),
      };
    });

    // Filtrer les données du tableau
    let updatedTableData = [...usersTableData.data];
    if (category !== "all") {
      // Simuler un filtre par catégorie préférée (non présent dans les données actuelles)
      updatedTableData = updatedTableData.filter((_, index) => index % 2 === 0);
    }
    if (location !== "all") {
      updatedTableData = updatedTableData.filter(
        (item) => item.location.toLowerCase() === location
      );
    }
    if (status !== "all") {
      updatedTableData = updatedTableData.filter(
        (item) => item.status.toLowerCase() === status
      );
    }

    // Appliquer les filtres aux données de séries temporelles
    // Dans un cas réel, ces données seraient filtrées côté serveur
    const updatedTimeSeriesData = usersTimeSeriesData.map((item) => {
      const activeUsers =
        typeof item["Utilisateurs actifs"] === "number"
          ? item["Utilisateurs actifs"]
          : 0;

      const newUsers =
        typeof item["Nouveaux utilisateurs"] === "number"
          ? item["Nouveaux utilisateurs"]
          : 0;

      return {
        ...item,
        "Utilisateurs actifs": Math.round(activeUsers * periodFactor),
        "Nouveaux utilisateurs": Math.round(newUsers * periodFactor),
      };
    });

    setFilteredKPIs(updatedKPIs);
    setFilteredTimeSeriesData(updatedTimeSeriesData);
    setFilteredTableData(updatedTableData);
  }, [period, category, location, status]);

  // Exporter les données
  const handleExport = () => {
    console.log("Exporting data...");
    // Logique d'exportation à implémenter
    alert("Exportation des données en cours...");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analyse des Utilisateurs</h1>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      <AdvancedAnalyticsFilters
        filterOptions={[
          {
            id: "period",
            label: "Période",
            options: periodOptions,
          },
          {
            id: "category",
            label: "Catégorie",
            options: categoryOptions,
          },
          {
            id: "location",
            label: "Localisation",
            options: locationOptions,
          },
          {
            id: "status",
            label: "Statut",
            options: statusOptions,
          },
        ]}
        initialFilters={{
          period: period as FilterPeriod,
          activeFilters: [
            ...(category !== "all"
              ? [
                  {
                    id: "category",
                    type: "category",
                    value: category,
                    label:
                      categoryOptions.find((o) => o.value === category)
                        ?.label || "",
                  },
                ]
              : []),
            ...(location !== "all"
              ? [
                  {
                    id: "location",
                    type: "location",
                    value: location,
                    label:
                      locationOptions.find((o) => o.value === location)
                        ?.label || "",
                  },
                ]
              : []),
            ...(status !== "all"
              ? [
                  {
                    id: "status",
                    type: "status",
                    value: status,
                    label:
                      statusOptions.find((o) => o.value === status)?.label ||
                      "",
                  },
                ]
              : []),
          ],
        }}
        onFiltersChange={(filters) => {
          if (filters.period) setPeriod(filters.period);

          // Traiter les filtres actifs
          if (filters.activeFilters) {
            filters.activeFilters.forEach((filter) => {
              if (
                filter.type === "category" &&
                typeof filter.value === "string"
              ) {
                setCategory(filter.value);
              } else if (
                filter.type === "location" &&
                typeof filter.value === "string"
              ) {
                setLocation(filter.value);
              } else if (
                filter.type === "status" &&
                typeof filter.value === "string"
              ) {
                setStatus(filter.value);
              }
            });
          }
        }}
      />

      <AnalyticsKPICards kpis={filteredKPIs} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des utilisateurs</CardTitle>
            <CardDescription>
              Nombre d&apos;utilisateurs actifs et nouveaux sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={filteredTimeSeriesData}
                title=""
                description=""
                series={[
                  { key: "Utilisateurs actifs", name: "Utilisateurs actifs" },
                  {
                    key: "Nouveaux utilisateurs",
                    name: "Nouveaux utilisateurs",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#3b82f6", "#10b981"],
                  showGrid: true,
                  showDots: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par âge</CardTitle>
            <CardDescription>
              Distribution des utilisateurs par tranche d&apos;âge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={ageDistributionData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: ageDistributionData.map((item) => item.color || ""),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par localisation</CardTitle>
            <CardDescription>
              Distribution des utilisateurs par ville
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={locationDistributionData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: locationDistributionData.map(
                    (item) => item.color || ""
                  ),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fréquence des réservations</CardTitle>
            <CardDescription>
              Nombre de réservations par utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={bookingFrequencyData}
                title=""
                description=""
                series={[{ key: "Utilisateurs", name: "Utilisateurs" }]}
                options={{
                  chartType: "bar",
                  colors: ["#3b82f6"],
                  showGrid: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des dépenses</CardTitle>
            <CardDescription>
              Répartition des utilisateurs par montant dépensé
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={spendingDistributionData}
                title=""
                description=""
                series={[{ key: "Utilisateurs", name: "Utilisateurs" }]}
                options={{
                  chartType: "bar",
                  colors: ["#8b5cf6"],
                  showGrid: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catégories préférées</CardTitle>
            <CardDescription>
              Répartition des préférences par catégorie d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={userPreferredCategoriesData}
                title=""
                description=""
                series={[{ key: "Utilisateurs", name: "Utilisateurs" }]}
                options={{
                  chartType: "bar",
                  colors: ["#f59e0b"],
                  showGrid: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des dépenses moyennes</CardTitle>
            <CardDescription>
              Montant moyen dépensé par utilisateur sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={avgSpendingTrendData}
                title=""
                description=""
                series={[
                  { key: "Dépense moyenne (€)", name: "Dépense moyenne (€)" },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#ef4444"],
                  showGrid: true,
                  showDots: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cohortes d&apos;utilisateurs</CardTitle>
            <CardDescription>
              Taux de rétention par cohorte d&apos;utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-auto">
              <MetricsComparison
                data={{
                  title: "",
                  description: "",
                  metrics: userCohortsData.metrics,
                  currentPeriod: userCohortsData.currentPeriod,
                  previousPeriod: userCohortsData.previousPeriod,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Tableau des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsDataTable
            columns={usersTableData.columns}
            data={filteredTableData}
            title="Tableau des utilisateurs"
            isLoading={false}
            onRowClick={(row) => console.log("Row clicked:", row)}
            onSortChange={(sortOptions) =>
              console.log("Sort changed:", sortOptions)
            }
            onPageChange={(page) => console.log("Page changed:", page)}
            onPageSizeChange={(pageSize) =>
              console.log("Page size changed:", pageSize)
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
