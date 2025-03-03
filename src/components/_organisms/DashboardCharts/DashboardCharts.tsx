"use client";

/**
 * Composant DashboardCharts - Affiche les graphiques du tableau de bord
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

/**
 * Type pour les données du graphique de réservations
 */
export interface ReservationChartData {
  /** Nom de la période (mois, jour, etc.) */
  name: string;
  /** Valeur (nombre de réservations) */
  value: number;
}

/**
 * Type pour les données du graphique de revenus
 */
export interface RevenueChartData {
  /** Nom de la période (mois, jour, etc.) */
  name: string;
  /** Chiffre d'affaires */
  revenue: number;
  /** Commissions */
  commission: number;
}

/**
 * Type pour les données du graphique d'utilisateurs
 */
export interface UsersChartData {
  /** Nom de la période (mois, jour, etc.) */
  name: string;
  /** Nouveaux utilisateurs */
  nouveaux: number;
  /** Utilisateurs actifs */
  actifs: number;
}

/**
 * Props pour le composant DashboardCharts
 */
interface DashboardChartsProps {
  /** Données pour le graphique des réservations */
  reservationsData: ReservationChartData[];
  /** Données pour le graphique du chiffre d'affaires */
  revenueData: RevenueChartData[];
  /** Données pour le graphique des utilisateurs */
  usersData: UsersChartData[];
  /** Titre de la section */
  title?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Type pour les props du CustomTooltip
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

/**
 * Composant DashboardCharts - Affiche les graphiques du tableau de bord
 */
const DashboardCharts = ({
  reservationsData,
  revenueData,
  usersData,
  title = "Analyse graphique",
  className,
}: DashboardChartsProps) => {
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState("reservations");

  // Fonction pour formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Composant personnalisé pour le tooltip des graphiques
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.toLowerCase().includes("revenu") ||
              entry.name.toLowerCase().includes("commission")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="reservations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="revenue">Chiffre d&apos;affaires</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reservationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Réservations"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Évolution du chiffre d&apos;affaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0ea5e9"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0ea5e9"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorCommission"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Chiffre d'affaires"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                      <Area
                        type="monotone"
                        dataKey="commission"
                        name="Commissions"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorCommission)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nouveaux"
                    name="Nouveaux utilisateurs"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actifs"
                    name="Utilisateurs actifs"
                    stroke="#f59e0b"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
