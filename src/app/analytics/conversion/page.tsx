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
  conversionKPIs,
  conversionRateTimeSeriesData,
  conversionsBySourceData,
  conversionsByDeviceData,
  conversionsByChannelData,
  costPerConversionTrendData,
  roiTrendData,
  conversionRateByCategoryData,
  conversionFunnelData,
  channelConversionComparisonData,
  conversionTableData,
  ConversionTableItem,
} from "@/mocks/analyticsConversionMocks";

/**
 * Page d'analyse des conversions
 * Affiche des KPIs, graphiques et tableaux pour l'analyse des conversions
 */
export default function ConversionAnalyticsPage() {
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<string>(
    searchParams.get("period") || "this-month"
  );
  const [source, setSource] = useState<string>(
    searchParams.get("source") || "all"
  );
  const [channel, setChannel] = useState<string>(
    searchParams.get("channel") || "all"
  );
  const [device, setDevice] = useState<string>(
    searchParams.get("device") || "all"
  );

  // Données filtrées pour les KPIs
  const [filteredKPIs, setFilteredKPIs] = useState(conversionKPIs);
  const [filteredTimeSeriesData, setFilteredTimeSeriesData] = useState(
    conversionRateTimeSeriesData
  );
  const [filteredTableData, setFilteredTableData] =
    useState<ConversionTableItem[]>(conversionTableData);

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

  const sourceOptions = useMemo(
    () => [
      { value: "all", label: "Toutes sources" },
      { value: "organic", label: "Recherche organique" },
      { value: "social", label: "Réseaux sociaux" },
      { value: "direct", label: "Trafic direct" },
      { value: "email", label: "Email marketing" },
      { value: "paid", label: "Référencement payant" },
      { value: "partners", label: "Partenaires" },
    ],
    []
  );

  const channelOptions = useMemo(
    () => [
      { value: "all", label: "Tous canaux" },
      { value: "web", label: "Site web" },
      { value: "mobile", label: "Application mobile" },
      { value: "phone", label: "Téléphone" },
      { value: "partners", label: "Partenaires" },
    ],
    []
  );

  const deviceOptions = [
    { value: "all", label: "Tous appareils" },
    { value: "mobile", label: "Mobile" },
    { value: "desktop", label: "Desktop" },
    { value: "tablet", label: "Tablette" },
  ];

  // Appliquer les filtres
  useEffect(() => {
    console.log("Applying filters:", { period, source, channel, device });

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
    const updatedKPIs = conversionKPIs.map((kpi) => {
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
    let updatedTableData = [...conversionTableData];
    if (source !== "all") {
      const sourceLabel = sourceOptions.find(
        (option) => option.value === source
      )?.label;
      if (sourceLabel) {
        updatedTableData = updatedTableData.filter(
          (item) => item.source === sourceLabel
        );
      }
    }
    if (channel !== "all") {
      const channelLabel = channelOptions.find(
        (option) => option.value === channel
      )?.label;
      if (channelLabel) {
        updatedTableData = updatedTableData.filter(
          (item) => item.channel === channelLabel
        );
      }
    }

    // Appliquer les filtres aux données de séries temporelles
    // Dans un cas réel, ces données seraient filtrées côté serveur
    const updatedTimeSeriesData = conversionRateTimeSeriesData.map((item) => {
      const tauxConversion =
        typeof item["Taux de conversion (%)"] === "number"
          ? item["Taux de conversion (%)"]
          : 0;

      return {
        ...item,
        "Taux de conversion (%)": parseFloat(
          (tauxConversion * periodFactor).toFixed(1)
        ),
      };
    });

    setFilteredKPIs(updatedKPIs);
    setFilteredTimeSeriesData(updatedTimeSeriesData);
    setFilteredTableData(updatedTableData);
  }, [period, source, channel, device, sourceOptions, channelOptions]);

  // Exporter les données
  const handleExport = () => {
    console.log("Exporting data...");
    // Logique d'exportation à implémenter
    alert("Exportation des données en cours...");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analyse des Conversions</h1>
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
            id: "source",
            label: "Source",
            options: sourceOptions,
          },
          {
            id: "channel",
            label: "Canal",
            options: channelOptions,
          },
          {
            id: "device",
            label: "Appareil",
            options: deviceOptions,
          },
        ]}
        initialFilters={{
          period: period as FilterPeriod,
          activeFilters: [
            ...(source !== "all"
              ? [
                  {
                    id: "source",
                    type: "source",
                    value: source,
                    label:
                      sourceOptions.find((o) => o.value === source)?.label ||
                      "",
                  },
                ]
              : []),
            ...(channel !== "all"
              ? [
                  {
                    id: "channel",
                    type: "channel",
                    value: channel,
                    label:
                      channelOptions.find((o) => o.value === channel)?.label ||
                      "",
                  },
                ]
              : []),
            ...(device !== "all"
              ? [
                  {
                    id: "device",
                    type: "device",
                    value: device,
                    label:
                      deviceOptions.find((o) => o.value === device)?.label ||
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
                filter.type === "source" &&
                typeof filter.value === "string"
              ) {
                setSource(filter.value);
              } else if (
                filter.type === "channel" &&
                typeof filter.value === "string"
              ) {
                setChannel(filter.value);
              } else if (
                filter.type === "device" &&
                typeof filter.value === "string"
              ) {
                setDevice(filter.value);
              }
            });
          }
        }}
      />

      <AnalyticsKPICards kpis={filteredKPIs} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du taux de conversion</CardTitle>
            <CardDescription>
              Évolution du taux de conversion sur la période
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
                    key: "Taux de conversion (%)",
                    name: "Taux de conversion (%)",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#3b82f6"],
                  showGrid: true,
                  showDots: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par source</CardTitle>
            <CardDescription>
              Distribution des conversions par source de trafic
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={conversionsBySourceData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: conversionsBySourceData.map(
                    (item) => item.color || ""
                  ),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par appareil</CardTitle>
            <CardDescription>
              Distribution des conversions par type d&apos;appareil
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={conversionsByDeviceData}
                title=""
                description=""
                options={{
                  chartType: "pie",
                  colors: conversionsByDeviceData.map(
                    (item) => item.color || ""
                  ),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par canal</CardTitle>
            <CardDescription>
              Distribution des conversions par canal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={conversionsByChannelData}
                title=""
                description=""
                series={[{ key: "Conversions", name: "Conversions" }]}
                options={{
                  chartType: "bar",
                  colors: ["#10b981"],
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
            <CardTitle>Évolution du coût par conversion</CardTitle>
            <CardDescription>
              Coût moyen pour acquérir une conversion sur la période
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={costPerConversionTrendData}
                title=""
                description=""
                series={[
                  {
                    key: "Coût par conversion (€)",
                    name: "Coût par conversion (€)",
                  },
                ]}
                options={{
                  chartType: "line",
                  colors: ["#f59e0b"],
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
            <CardTitle>Évolution du ROI marketing</CardTitle>
            <CardDescription>
              Retour sur investissement des actions marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={roiTrendData}
                title=""
                description=""
                series={[{ key: "ROI (%)", name: "ROI (%)" }]}
                options={{
                  chartType: "line",
                  colors: ["#8b5cf6"],
                  showGrid: true,
                  showDots: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion par catégorie</CardTitle>
            <CardDescription>
              Taux de conversion par catégorie d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={conversionRateByCategoryData}
                title=""
                description=""
                series={[
                  {
                    key: "Taux de conversion (%)",
                    name: "Taux de conversion (%)",
                  },
                ]}
                options={{
                  chartType: "bar",
                  colors: ["#ec4899"],
                  showGrid: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entonnoir de conversion</CardTitle>
            <CardDescription>
              Parcours de conversion des visiteurs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <AdvancedAnalyticsChart
                data={conversionFunnelData}
                title=""
                description=""
                series={[{ key: "Nombre", name: "Nombre" }]}
                options={{
                  chartType: "bar",
                  colors: ["#ef4444"],
                  showGrid: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparaison des taux de conversion par canal</CardTitle>
          <CardDescription>
            Comparaison avec la période précédente par canal
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto">
            <MetricsComparison data={channelConversionComparisonData} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Détail des conversions</CardTitle>
            <CardDescription>
              Liste détaillée des conversions avec filtrage et tri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsDataTable
              columns={[
                {
                  id: "id",
                  header: "ID",
                  accessorFn: (row: ConversionTableItem) => row.id,
                },
                {
                  id: "date",
                  header: "Date",
                  accessorFn: (row: ConversionTableItem) => row.date,
                },
                {
                  id: "source",
                  header: "Source",
                  accessorFn: (row: ConversionTableItem) => row.source,
                },
                {
                  id: "channel",
                  header: "Canal",
                  accessorFn: (row: ConversionTableItem) => row.channel,
                },
                {
                  id: "device",
                  header: "Appareil",
                  accessorFn: (row: ConversionTableItem) => row.device,
                },
                {
                  id: "category",
                  header: "Catégorie",
                  accessorFn: (row: ConversionTableItem) => row.category,
                },
                {
                  id: "value",
                  header: "Valeur",
                  accessorFn: (row: ConversionTableItem) => row.value,
                },
              ]}
              data={filteredTableData}
              onRowClick={(row) => console.log("Row clicked:", row)}
              onSortChange={(sortState) =>
                console.log("Sort changed:", sortState)
              }
              onPageChange={(page) => console.log("Page changed:", page)}
              pageSize={10}
              currentPage={0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Données pour le tableau des conversions
 */
