"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { LineChart, PieChart, BarChart, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ReportNavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function ReportNavItem({ href, icon, title, isActive }: ReportNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

/**
 * Layout pour la section rapports
 */
export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Déterminer le rapport actif en fonction du chemin
  const getActiveReport = () => {
    if (pathname.includes("/mensuel")) return "mensuel";
    if (pathname.includes("/trimestriel")) return "trimestriel";
    if (pathname.includes("/annuel")) return "annuel";
    if (pathname.includes("/personnalise")) return "personnalise";
    return "";
  };

  // Liste des types de rapports
  const reportTypes = [
    {
      title: "Rapport mensuel",
      href: "/analytics/rapports/mensuel",
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      title: "Rapport trimestriel",
      href: "/analytics/rapports/trimestriel",
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      title: "Rapport annuel",
      href: "/analytics/rapports/annuel",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Rapport personnalisé",
      href: "/analytics/rapports/personnalise",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapports</h2>
          <p className="text-muted-foreground">
            Consultez et analysez les rapports détaillés sur les performances de
            votre entreprise
          </p>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Sidebar avec les types de rapports */}
        <div className="md:col-span-3">
          <div className="space-y-1">
            <h3 className="text-lg font-medium mb-2">Rapports</h3>
            <nav className="flex flex-col space-y-1">
              {reportTypes.map((report) => (
                <ReportNavItem
                  key={report.title}
                  href={report.href}
                  icon={report.icon}
                  title={report.title}
                  isActive={getActiveReport() === report.href.split("/").pop()}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="md:col-span-9">{children}</div>
      </div>
    </div>
  );
}
