"use client";

/**
 * Composant MetricsComparison - Comparaison de métriques côte à côte
 */

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowRightLeft,
} from "lucide-react";

/**
 * Type pour une métrique
 */
export interface Metric {
  /** Identifiant unique */
  id: string;
  /** Nom de la métrique */
  name: string;
  /** Valeur actuelle */
  currentValue: number;
  /** Valeur précédente */
  previousValue: number;
  /** Pourcentage de changement */
  changePercentage: number;
  /** Unité (€, %, etc.) */
  unit?: string;
  /** Format des nombres */
  format?: "standard" | "compact" | "currency" | "percent";
  /** Données historiques */
  history?: Array<{ date: string; value: number }>;
  /** Objectif */
  target?: number;
  /** Couleur */
  color?: string;
}

/**
 * Type pour une comparaison de métriques
 */
export interface MetricsComparisonData {
  /** Titre de la comparaison */
  title: string;
  /** Description */
  description?: string;
  /** Période actuelle */
  currentPeriod: string;
  /** Période précédente */
  previousPeriod: string;
  /** Métriques à comparer */
  metrics: Metric[];
}

/**
 * Props pour le composant MetricsComparison
 */
export interface MetricsComparisonProps {
  /** Données de comparaison */
  data: MetricsComparisonData;
  /** Type de visualisation */
  visualizationType?: "bars" | "bar" | "lines" | "line" | "pie" | "progress";
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Couleurs par défaut pour les graphiques
 */
const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#06b6d4", // cyan
];

/**
 * Composant MetricsComparison
 */
const MetricsComparison: React.FC<MetricsComparisonProps> = ({
  data,
  visualizationType = "bars",
  className,
}) => {
  // Normaliser le type de visualisation pour gérer les formes singulières et plurielles
  const normalizedType =
    visualizationType === "bar"
      ? "bars"
      : visualizationType === "line"
      ? "lines"
      : visualizationType;

  // Formater les valeurs numériques selon les options
  const formatValue = (
    value: number,
    format?: string,
    unit?: string
  ): string => {
    switch (format) {
      case "compact":
        return (
          new Intl.NumberFormat("fr-FR", {
            notation: "compact",
            compactDisplay: "short",
          }).format(value) + (unit ? ` ${unit}` : "")
        );
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
        return (
          new Intl.NumberFormat("fr-FR").format(value) +
          (unit ? ` ${unit}` : "")
        );
    }
  };

  // Calculer le pourcentage d'atteinte de l'objectif
  const calculateTargetPercentage = (
    current: number,
    target?: number
  ): number => {
    if (!target || target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  // Préparer les données pour le graphique en barres
  const prepareBarData = () => {
    return data.metrics.map((metric) => ({
      name: metric.name,
      current: metric.currentValue,
      previous: metric.previousValue,
      color:
        metric.color ||
        DEFAULT_COLORS[data.metrics.indexOf(metric) % DEFAULT_COLORS.length],
    }));
  };

  // Préparer les données pour le graphique en camembert
  const preparePieData = () => {
    // S'assurer que toutes les valeurs sont positives pour le graphique en camembert
    return data.metrics.map((metric) => ({
      name: metric.name,
      value: Math.max(0, metric.currentValue), // Utiliser des valeurs positives uniquement
      color:
        metric.color ||
        DEFAULT_COLORS[data.metrics.indexOf(metric) % DEFAULT_COLORS.length],
    }));
  };

  // Préparer les données pour le graphique en lignes
  const prepareLineData = () => {
    // Si les métriques ont un historique, l'utiliser
    if (
      data.metrics.some((metric) => metric.history && metric.history.length > 0)
    ) {
      // Trouver toutes les dates uniques
      const allDates = new Set<string>();
      data.metrics.forEach((metric) => {
        metric.history?.forEach((point) => {
          allDates.add(point.date);
        });
      });

      // Trier les dates
      const sortedDates = Array.from(allDates).sort();

      // Créer les données pour chaque date
      return sortedDates.map((date) => {
        const point: Record<string, string | number | null> = { date };
        data.metrics.forEach((metric) => {
          const historyPoint = metric.history?.find((h) => h.date === date);
          point[metric.id] = historyPoint ? historyPoint.value : null;
        });
        return point;
      });
    }

    // Sinon, utiliser simplement les valeurs actuelles et précédentes
    return [
      {
        name: data.previousPeriod,
        ...data.metrics.reduce((acc, metric) => {
          acc[metric.id] = metric.previousValue;
          return acc;
        }, {} as Record<string, number>),
      },
      {
        name: data.currentPeriod,
        ...data.metrics.reduce((acc, metric) => {
          acc[metric.id] = metric.currentValue;
          return acc;
        }, {} as Record<string, number>),
      },
    ];
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
          {payload.map((entry, index) => {
            const metric = data.metrics.find(
              (m) => m.id === entry.dataKey || entry.name === m.name
            );
            return (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}:{" "}
                {metric
                  ? formatValue(entry.value, metric.format, metric.unit)
                  : entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Rendu de la visualisation en fonction du type
  const renderVisualization = () => {
    switch (normalizedType) {
      case "bars":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareBarData()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="current"
                name={`Actuel (${data.currentPeriod})`}
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="previous"
                name={`Précédent (${data.previousPeriod})`}
                fill="#94a3b8"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "lines":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareLineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {data.metrics.map((metric, index) => (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.id}
                  name={metric.name}
                  stroke={
                    metric.color ||
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={preparePieData()}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                innerRadius={60} // Ajouter un rayon intérieur pour créer un donut chart
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                paddingAngle={2} // Ajouter un espace entre les segments
              >
                {preparePieData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatValue(Number(value), "standard")}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        );
      case "progress":
        return (
          <div className="space-y-6">
            {data.metrics.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-0.5",
                          metric.changePercentage > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {metric.changePercentage > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(metric.changePercentage).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {formatValue(
                          metric.previousValue,
                          metric.format,
                          metric.unit
                        )}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                      <span>
                        {formatValue(
                          metric.currentValue,
                          metric.format,
                          metric.unit
                        )}
                      </span>
                    </div>
                  </div>
                  {metric.target && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Objectif
                      </div>
                      <div>
                        {formatValue(metric.target, metric.format, metric.unit)}
                      </div>
                    </div>
                  )}
                </div>
                {metric.target && (
                  <div className="space-y-1">
                    <Progress
                      value={calculateTargetPercentage(
                        metric.currentValue,
                        metric.target
                      )}
                      className={cn(
                        "h-2",
                        metric.color ? { backgroundColor: metric.color } : "",
                        metric.currentValue >= metric.target
                          ? "bg-green-500"
                          : metric.currentValue >= metric.target * 0.8
                          ? "bg-amber-500"
                          : "bg-red-500"
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>
                        {calculateTargetPercentage(
                          metric.currentValue,
                          metric.target
                        ).toFixed(0)}
                        %
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && (
          <CardDescription>{data.description}</CardDescription>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Comparaison:</span>
          <Badge variant="outline">{data.currentPeriod}</Badge>
          <ArrowRightLeft className="h-3 w-3" />
          <Badge variant="outline">{data.previousPeriod}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={normalizedType} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bars">Barres</TabsTrigger>
            <TabsTrigger value="lines">Lignes</TabsTrigger>
            <TabsTrigger value="pie">Camembert</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
          </TabsList>
          <TabsContent value="bars" className="mt-4">
            {renderVisualization()}
          </TabsContent>
          <TabsContent value="lines" className="mt-4">
            {renderVisualization()}
          </TabsContent>
          <TabsContent value="pie" className="mt-4">
            {renderVisualization()}
          </TabsContent>
          <TabsContent value="progress" className="mt-4">
            {renderVisualization()}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.metrics.map((metric) => (
            <div key={metric.id} className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatValue(metric.currentValue, metric.format, metric.unit)}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-0.5",
                    metric.changePercentage > 0
                      ? "text-green-600 dark:text-green-400"
                      : metric.changePercentage < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {metric.changePercentage > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : metric.changePercentage < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {Math.abs(metric.changePercentage).toFixed(1)}%
                </Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Précédent:{" "}
                {formatValue(metric.previousValue, metric.format, metric.unit)}
              </div>
              {metric.target && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between mb-1">
                    <span>
                      Objectif:{" "}
                      {formatValue(metric.target, metric.format, metric.unit)}
                    </span>
                    <span>
                      {calculateTargetPercentage(
                        metric.currentValue,
                        metric.target
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={calculateTargetPercentage(
                      metric.currentValue,
                      metric.target
                    )}
                    className={cn(
                      "h-2",
                      metric.color ? { backgroundColor: metric.color } : "",
                      metric.currentValue >= metric.target
                        ? "bg-green-500"
                        : metric.currentValue >= metric.target * 0.8
                        ? "bg-amber-500"
                        : "bg-red-500"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsComparison;
