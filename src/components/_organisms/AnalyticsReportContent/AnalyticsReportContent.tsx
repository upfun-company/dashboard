"use client";

/**
 * Composant AnalyticsReportContent - Affiche le contenu d'un rapport en fonction de son type
 */

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ReportData,
  ChartDataItem,
  TableDataItem,
  SummaryDataType,
} from "@/mocks/analyticsReportsMocks";

/**
 * Interface pour les propriétés du composant AnalyticsReportContent
 */
export interface AnalyticsReportContentProps {
  /** Données du rapport */
  reportData: ReportData;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher un graphique
 */
const ChartContent: React.FC<{ data: ChartDataItem[]; type?: string }> = ({
  data,
  type = "bar",
}) => {
  // Fonction pour formater les dates sur l'axe X
  const formatXAxis = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM", { locale: fr });
    } catch {
      return dateStr;
    }
  };

  // Déterminer les clés de données (en excluant la clé de date)
  const dataKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== "date" && key !== "name"
  );

  // Couleurs pour les différentes séries
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={data[0]?.date ? "date" : "name"}
            tickFormatter={data[0]?.date ? formatXAxis : undefined}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={data[0]?.date ? "date" : "name"}
            tickFormatter={data[0]?.date ? formatXAxis : undefined}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Par défaut, afficher un graphique à barres
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={data[0]?.date ? "date" : "name"}
          tickFormatter={data[0]?.date ? formatXAxis : undefined}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Composant pour afficher un tableau
 */
const TableContent: React.FC<{ data: TableDataItem[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">Aucune donnée disponible</div>;
  }

  // Obtenir les en-têtes du tableau à partir des clés du premier élément
  const headers = Object.keys(data[0]);

  // Fonction pour formater les valeurs du tableau
  const formatValue = (value: string | number | boolean | Date): string => {
    if (value === null || value === undefined) return "-";

    if (value instanceof Date) {
      return format(value, "dd/MM/yyyy");
    }

    if (typeof value === "boolean") {
      return value ? "Oui" : "Non";
    }

    if (typeof value === "number") {
      // Formater les nombres comme des montants si c'est approprié
      if (value > 100) {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(value);
      }
      return value.toString();
    }

    return value;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="capitalize">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header}`}>
                  {formatValue(row[header])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/**
 * Composant pour afficher un résumé
 */
const SummaryContent: React.FC<{ data: SummaryDataType }> = ({ data }) => {
  if (!data) {
    return <div className="text-center py-4">Aucune donnée disponible</div>;
  }

  // Fonction pour formater les clés du résumé
  const formatKey = (key: string) => {
    return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  // Fonction pour formater les valeurs du résumé
  const formatValue = (value: string | number | boolean | Date): string => {
    if (value === null || value === undefined) return "-";

    if (value instanceof Date) {
      return format(value, "dd/MM/yyyy");
    }

    if (typeof value === "boolean") {
      return value ? "Oui" : "Non";
    }

    if (typeof value === "number") {
      // Formater les nombres comme des montants si c'est approprié
      if (value > 100) {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(value);
      }
      return value.toString();
    }

    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key} className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              {formatKey(key)}
            </div>
            <div className="text-2xl font-bold mt-1">{formatValue(value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * Composant principal pour afficher le contenu d'un rapport analytique
 */
const AnalyticsReportContent: React.FC<AnalyticsReportContentProps> = ({
  reportData,
  className,
}) => {
  // Déterminer le type de contenu à afficher
  const renderContent = () => {
    switch (reportData.type) {
      case "chart":
        return reportData.chartData ? (
          <ChartContent data={reportData.chartData} type="line" />
        ) : null;
      case "table":
        return reportData.tableData ? (
          <TableContent data={reportData.tableData} />
        ) : null;
      case "summary":
        return reportData.summaryData ? (
          <SummaryContent data={reportData.summaryData} />
        ) : null;
      case "mixed":
        return (
          <div className="space-y-6">
            {reportData.summaryData ? (
              <SummaryContent data={reportData.summaryData} />
            ) : null}
            {reportData.chartData ? (
              <ChartContent data={reportData.chartData} />
            ) : null}
            {reportData.tableData ? (
              <TableContent data={reportData.tableData} />
            ) : null}
          </div>
        );
      default:
        return <div>Type de rapport non pris en charge</div>;
    }
  };

  return <div className={cn("w-full", className)}>{renderContent()}</div>;
};

export default AnalyticsReportContent;
