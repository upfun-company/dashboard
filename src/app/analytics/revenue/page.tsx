"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  revenueKPIs,
  revenueTimeSeriesData,
  revenueByCategoryData,
  revenueByLocationData,
  revenueByPaymentMethodData,
  avgOrderValueTrendData,
  revenueByProviderData,
  commissionRateTrendData,
  categoryRevenueComparisonData,
  revenueTableData,
} from "@/mocks/analyticsRevenueMocks";

/**
 * Page d'analyse des revenus
 * Affiche des KPIs, graphiques et tableaux pour l'analyse des revenus
 */
export default function RevenueAnalyticsPage() {
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
  const [paymentMethod, setPaymentMethod] = useState<string>(
    searchParams.get("paymentMethod") || "all"
  );

  // Données filtrées pour les KPIs
  const [filteredKPIs, setFilteredKPIs] = useState(revenueKPIs);
  const [filteredTimeSeriesData, setFilteredTimeSeriesData] = useState(
    revenueTimeSeriesData
  );
  const [filteredTableData, setFilteredTableData] = useState(revenueTableData);

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

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Toutes catégories" },
      { value: "sports-nautiques", label: "Sports nautiques" },
      { value: "randonnee", label: "Randonnée" },
      { value: "bien-etre", label: "Bien-être" },
      { value: "gastronomie", label: "Gastronomie" },
      { value: "culture", label: "Culture" },
      { value: "aventure", label: "Aventure" },
    ],
    []
  );

  const locationOptions = useMemo(
    () => [
      { value: "all", label: "Toutes localisations" },
      { value: "paris", label: "Paris" },
      { value: "lyon", label: "Lyon" },
      { value: "marseille", label: "Marseille" },
      { value: "bordeaux", label: "Bordeaux" },
      { value: "nice", label: "Nice" },
      { value: "autres", label: "Autres" },
    ],
    []
  );

  const paymentMethodOptions = useMemo(
    () => [
      { value: "all", label: "Toutes méthodes" },
      { value: "carte", label: "Carte bancaire" },
      { value: "paypal", label: "PayPal" },
      { value: "virement", label: "Virement" },
      { value: "apple-pay", label: "Apple Pay" },
      { value: "google-pay", label: "Google Pay" },
    ],
    []
  );

  // Appliquer les filtres
  useEffect(() => {
    console.log("Applying filters:", {
      period,
      category,
      location,
      paymentMethod,
    });

    // Simuler l'application des filtres
    let periodFactor = 1.0;
    switch (period) {
      case "today":
        periodFactor = 0.03;
        break;
      case "yesterday":
        periodFactor = 0.03;
        break;
      case "this-week":
        periodFactor = 0.2;
        break;
      case "last-week":
        periodFactor = 0.2;
        break;
      case "this-month":
        periodFactor = 1.0;
        break;
      case "last-month":
        periodFactor = 0.95;
        break;
      case "this-year":
        periodFactor = 12.0;
        break;
      case "last-year":
        periodFactor = 11.5;
        break;
      case "all-time":
        periodFactor = 36.0;
        break;
      default:
        periodFactor = 1.0;
    }

    // Appliquer les facteurs aux KPIs
    const updatedKPIs = revenueKPIs.map((kpi) => {
      const ratio = periodFactor;
      // Assurer que les valeurs sont des nombres
      const value = typeof kpi.value === "number" ? kpi.value : 0;
      const previousValue =
        typeof kpi.previousValue === "number" ? kpi.previousValue : 0;

      const newValue = Math.round(value * ratio * 100) / 100;
      const newPreviousValue = Math.round(previousValue * ratio * 100) / 100;
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
    let updatedTableData = [...revenueTableData];
    if (category !== "all") {
      const categoryLabel = categoryOptions.find(
        (option) => option.value === category
      )?.label;
      if (categoryLabel) {
        updatedTableData = updatedTableData.filter(
          (item) => item.category === categoryLabel
        );
      }
    }
    if (location !== "all") {
      const locationLabel = locationOptions.find(
        (option) => option.value === location
      )?.label;
      if (locationLabel) {
        updatedTableData = updatedTableData.filter(
          (item) => item.location === locationLabel
        );
      }
    }
    if (paymentMethod !== "all") {
      const paymentMethodLabel = paymentMethodOptions.find(
        (option) => option.value === paymentMethod
      )?.label;
      if (paymentMethodLabel) {
        updatedTableData = updatedTableData.filter(
          (item) => item.paymentMethod === paymentMethodLabel
        );
      }
    }

    // Appliquer les filtres aux données de séries temporelles
    // Dans un cas réel, ces données seraient filtrées côté serveur
    const updatedTimeSeriesData = revenueTimeSeriesData.map((item) => {
      const revenu =
        typeof item["Revenu (€)"] === "number" ? item["Revenu (€)"] : 0;

      return {
        ...item,
        "Revenu (€)": Math.round(revenu * periodFactor),
      };
    });

    setFilteredKPIs(updatedKPIs);
    setFilteredTimeSeriesData(updatedTimeSeriesData);
    setFilteredTableData(updatedTableData);
  }, [
    period,
    category,
    location,
    paymentMethod,
    categoryOptions,
    locationOptions,
    paymentMethodOptions,
  ]);

  // Exporter les données
  const handleExport = () => {
    console.log("Exporting data...");
    // Logique d'exportation à implémenter
    alert("Exportation des données en cours...");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analyse des Revenus</h1>
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
            id: "paymentMethod",
            label: "Méthode de paiement",
            options: paymentMethodOptions,
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
            ...(paymentMethod !== "all"
              ? [
                  {
                    id: "paymentMethod",
                    type: "paymentMethod",
                    value: paymentMethod,
                    label:
                      paymentMethodOptions.find(
                        (o) => o.value === paymentMethod
                      )?.label || "",
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
                filter.type === "paymentMethod" &&
                typeof filter.value === "string"
              ) {
                setPaymentMethod(filter.value);
              }
            });
          }
        }}
      />

      <AnalyticsKPICards kpis={filteredKPIs} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
            <CardDescription>
              Évolution des revenus sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={filteredTimeSeriesData}
                title=""
                description=""
                series={[
                  {
                    key: "Revenu (€)",
                    name: "Revenu (€)",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#3b82f6"],
                  showGrid: true,
                  showDots: true,
                  numberFormat: "currency",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>
              Distribution des revenus par catégorie d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={revenueByCategoryData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: revenueByCategoryData.map((item) => item.color || ""),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par localisation</CardTitle>
            <CardDescription>
              Distribution des revenus par ville
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={revenueByLocationData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: revenueByLocationData.map((item) => item.color || ""),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par méthode de paiement</CardTitle>
            <CardDescription>
              Distribution des revenus par méthode de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={revenueByPaymentMethodData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: revenueByPaymentMethodData.map(
                    (item) => item.color || ""
                  ),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du panier moyen</CardTitle>
            <CardDescription>
              Évolution du panier moyen sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={avgOrderValueTrendData}
                title=""
                description=""
                series={[
                  {
                    key: "Panier moyen (€)",
                    name: "Panier moyen (€)",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#10b981"],
                  showGrid: true,
                  showDots: true,
                  numberFormat: "currency",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par tranche de prix</CardTitle>
            <CardDescription>
              Distribution des revenus par tranche de prix
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={revenueByProviderData}
                title=""
                description=""
                series={[
                  {
                    key: "Revenu (€)",
                    name: "Revenu (€)",
                  },
                ]}
                options={{
                  chartType: "bar",
                  colors: ["#8b5cf6"],
                  showGrid: true,
                  numberFormat: "currency",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution du taux de commission</CardTitle>
            <CardDescription>
              Évolution du taux de commission sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={commissionRateTrendData}
                title=""
                description=""
                series={[
                  {
                    key: "Taux de commission (%)",
                    name: "Taux de commission (%)",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#f59e0b"],
                  showGrid: true,
                  showDots: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparaison des revenus par catégorie</CardTitle>
            <CardDescription>
              Comparaison avec la période précédente par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-auto">
              <MetricsComparison data={categoryRevenueComparisonData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tableau des revenus</CardTitle>
          <CardDescription>
            Liste détaillée des revenus avec leurs informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsDataTable
            columns={[
              {
                id: "date",
                header: "Date",
                accessorFn: (row) => row.date,
              },
              {
                id: "source",
                header: "Source",
                accessorFn: (row) => row.source,
              },
              {
                id: "category",
                header: "Catégorie",
                accessorFn: (row) => row.category,
              },
              {
                id: "amount",
                header: "Montant",
                accessorFn: (row) => row.amount,
                cell: (value) =>
                  value ? `${value.toLocaleString("fr-FR")} €` : "0 €",
              },
              {
                id: "fees",
                header: "Frais",
                accessorFn: (row) => row.fees,
                cell: (value) =>
                  value ? `${value.toLocaleString("fr-FR")} €` : "0 €",
              },
              {
                id: "netAmount",
                header: "Montant net",
                accessorFn: (row) => row.netAmount,
                cell: (value) =>
                  value ? `${value.toLocaleString("fr-FR")} €` : "0 €",
              },
              {
                id: "paymentMethod",
                header: "Méthode de paiement",
                accessorFn: (row) => row.paymentMethod,
              },
              {
                id: "status",
                header: "Statut",
                accessorFn: (row) => row.status,
                cell: (value) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      value === "Complété"
                        ? "bg-green-100 text-green-800"
                        : value === "En attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : value === "Remboursé"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
              {
                id: "location",
                header: "Localisation",
                accessorFn: (row) => row.location,
              },
            ]}
            data={filteredTableData}
            title="Tableau des revenus"
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
