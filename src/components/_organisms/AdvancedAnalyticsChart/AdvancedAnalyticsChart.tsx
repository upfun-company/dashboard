"use client";

/**
 * Composant AdvancedAnalyticsChart - Graphique d'analyse avancé avec options de personnalisation
 */

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

/**
 * Type pour les données de série temporelle
 */
export interface TimeSeriesData {
  /** Étiquette (date, période, etc.) */
  label: string;
  /** Valeurs pour chaque série */
  [key: string]: string | number;
}

/**
 * Type pour les données de graphique en camembert
 */
export interface PieChartData {
  /** Nom de la catégorie */
  name: string;
  /** Valeur */
  value: number;
  /** Couleur (optionnelle) */
  color?: string;
}

/**
 * Type pour les options de visualisation
 */
export interface VisualizationOptions {
  /** Type de graphique */
  chartType: "line" | "bar" | "area" | "pie" | "radar";
  /** Empilé (pour les graphiques à barres et aires) */
  stacked?: boolean;
  /** Afficher les points (pour les graphiques linéaires) */
  showDots?: boolean;
  /** Afficher la grille */
  showGrid?: boolean;
  /** Couleurs personnalisées */
  colors?: string[];
  /** Unité (€, %, etc.) */
  unit?: string;
  /** Format des nombres */
  numberFormat?: "standard" | "compact" | "currency" | "percent";
}

/**
 * Props pour le composant AdvancedAnalyticsChart
 */
export interface AdvancedAnalyticsChartProps {
  /** Titre du graphique */
  title: string;
  /** Description du graphique */
  description?: string;
  /** Données pour le graphique (séries temporelles ou données de camembert) */
  data: TimeSeriesData[] | PieChartData[];
  /** Séries à afficher (pour les graphiques de séries temporelles) */
  series?: {
    /** Clé de la série dans les données */
    key: string;
    /** Nom à afficher pour la série */
    name: string;
    /** Couleur de la série */
    color?: string;
  }[];
  /** Options de visualisation */
  options?: Partial<VisualizationOptions>;
  /** Fonction appelée lors du changement d'options */
  onOptionsChange?: (options: VisualizationOptions) => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Masquer l'en-tête (titre et description) */
  hideHeader?: boolean;
}

// Couleurs par défaut pour les graphiques
const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#6366f1", // indigo
  "#f97316", // orange
];

/**
 * Composant AdvancedAnalyticsChart - Graphique d'analyse avancé avec options de personnalisation
 */
const AdvancedAnalyticsChart: React.FC<AdvancedAnalyticsChartProps> = ({
  title,
  description,
  data,
  series = [],
  options = {},
  className,
  hideHeader = false,
}) => {
  // Options de visualisation avec valeurs par défaut
  const [visualizationOptions] = useState<VisualizationOptions>({
    chartType: options.chartType || "line",
    stacked: options.stacked || false,
    showDots: options.showDots !== undefined ? options.showDots : true,
    showGrid: options.showGrid !== undefined ? options.showGrid : true,
    colors: options.colors || DEFAULT_COLORS,
    unit: options.unit || "",
    numberFormat: options.numberFormat || "standard",
  });

  // Détermine si les données sont de type série temporelle ou camembert
  const isTimeSeriesData = (
    data: (TimeSeriesData | PieChartData)[]
  ): data is TimeSeriesData[] => {
    return data.length > 0 && "label" in data[0];
  };

  // Détermine si les données sont de type camembert
  const isPieChartData = (
    data: (TimeSeriesData | PieChartData)[]
  ): data is PieChartData[] => {
    return data.length > 0 && "name" in data[0] && "value" in data[0];
  };

  // Formater les valeurs numériques selon les options
  const formatValue = (value: number): string => {
    switch (visualizationOptions.numberFormat) {
      case "compact":
        return new Intl.NumberFormat("fr-FR", {
          notation: "compact",
          compactDisplay: "short",
        }).format(value);
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(value);
      case "percent":
        return new Intl.NumberFormat("fr-FR", {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(value / 100);
      default:
        return new Intl.NumberFormat("fr-FR").format(value);
    }
  };

  // Personnalisation du tooltip pour les graphiques
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      dataKey?: string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)}
              {visualizationOptions.unit &&
              !["currency", "percent"].includes(
                visualizationOptions.numberFormat || "standard"
              )
                ? ` ${visualizationOptions.unit}`
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Personnalisation du tooltip pour les graphiques en camembert
  interface PieTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  }

  const CustomPieTooltip = ({ active, payload }: PieTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            {formatValue(payload[0].value)}
            {visualizationOptions.unit &&
            !["currency", "percent"].includes(
              visualizationOptions.numberFormat || "standard"
            )
              ? ` ${visualizationOptions.unit}`
              : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  // Télécharger les données au format CSV
  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";

    // En-têtes
    if (isTimeSeriesData(data)) {
      const headers = ["Date"];
      series.forEach((s) => headers.push(s.name));
      csvContent += headers.join(",") + "\n";

      // Données
      data.forEach((row) => {
        const values = [row.label];
        series.forEach((s) => values.push(String(row[s.key] || 0)));
        csvContent += values.join(",") + "\n";
      });
    } else if (isPieChartData(data)) {
      csvContent += "Catégorie,Valeur\n";
      data.forEach((item) => {
        csvContent += `${item.name},${item.value}\n`;
      });
    }

    // Télécharger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${title.toLowerCase().replace(/\s+/g, "_")}_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rendu du graphique en fonction du type
  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </div>
      );
    }

    // Graphique en camembert
    if (
      visualizationOptions.chartType === "pie" ||
      (isPieChartData(data) &&
        !["line", "bar", "area", "radar"].includes(
          visualizationOptions.chartType
        ))
    ) {
      if (!isPieChartData(data)) {
        return (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              Les données ne sont pas au format approprié pour un graphique en
              camembert
            </p>
          </div>
        );
      }

      return (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  name,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color ||
                      (visualizationOptions.colors
                        ? visualizationOptions.colors[
                            index % visualizationOptions.colors.length
                          ]
                        : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Graphique radar
    if (visualizationOptions.chartType === "radar") {
      if (!isTimeSeriesData(data)) {
        return (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              Les données ne sont pas au format approprié pour un graphique
              radar
            </p>
          </div>
        );
      }

      return (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" />
              <PolarRadiusAxis />
              {series.map((s, index) => (
                <Radar
                  key={s.key}
                  name={s.name}
                  dataKey={s.key}
                  stroke={
                    s.color ||
                    (visualizationOptions.colors
                      ? visualizationOptions.colors[
                          index % visualizationOptions.colors.length
                        ]
                      : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                  }
                  fill={
                    s.color ||
                    (visualizationOptions.colors
                      ? visualizationOptions.colors[
                          index % visualizationOptions.colors.length
                        ]
                      : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                  }
                  fillOpacity={0.6}
                />
              ))}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Graphiques de séries temporelles (ligne, barre, aire)
    if (!isTimeSeriesData(data)) {
      return (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">
            Les données ne sont pas au format approprié pour un graphique de
            séries temporelles
          </p>
        </div>
      );
    }

    // Graphique en ligne
    if (visualizationOptions.chartType === "line") {
      return (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {visualizationOptions.showGrid && (
                <CartesianGrid strokeDasharray="3 3" />
              )}
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, index) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={
                    s.color ||
                    (visualizationOptions.colors
                      ? visualizationOptions.colors[
                          index % visualizationOptions.colors.length
                        ]
                      : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                  }
                  activeDot={{ r: visualizationOptions.showDots ? 8 : 0 }}
                  dot={visualizationOptions.showDots}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Graphique en aire
    if (visualizationOptions.chartType === "area") {
      return (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              {visualizationOptions.showGrid && (
                <CartesianGrid strokeDasharray="3 3" />
              )}
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, index) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={
                    s.color ||
                    (visualizationOptions.colors
                      ? visualizationOptions.colors[
                          index % visualizationOptions.colors.length
                        ]
                      : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                  }
                  fill={
                    s.color ||
                    (visualizationOptions.colors
                      ? visualizationOptions.colors[
                          index % visualizationOptions.colors.length
                        ]
                      : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                  }
                  stackId={visualizationOptions.stacked ? "1" : undefined}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Graphique en barres (par défaut)
    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {visualizationOptions.showGrid && (
              <CartesianGrid strokeDasharray="3 3" />
            )}
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {series.map((s, index) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={
                  s.color ||
                  (visualizationOptions.colors
                    ? visualizationOptions.colors[
                        index % visualizationOptions.colors.length
                      ]
                    : DEFAULT_COLORS[index % DEFAULT_COLORS.length])
                }
                stackId={visualizationOptions.stacked ? "a" : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card className={cn("h-full", className)}>
      {!hideHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={downloadCSV}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

export default AdvancedAnalyticsChart;
