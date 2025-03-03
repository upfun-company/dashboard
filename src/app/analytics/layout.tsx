"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  HelpCircle,
  LifeBuoy,
  Settings,
  Users,
  Wallet,
  Percent,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
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

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      title: "Vue d'ensemble",
      href: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Revenus",
      href: "/analytics/revenue",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: "Utilisateurs",
      href: "/analytics/utilisateurs",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Prestataires",
      href: "/analytics/prestataires",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Réservations",
      href: "/analytics/reservations",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Conversion",
      href: "/analytics/conversion",
      icon: <Percent className="h-4 w-4" />,
    },
    {
      title: "Rapports",
      href: "/analytics/rapports",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        <aside className="w-[250px] flex-col border-r px-4 py-6 hidden md:flex">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground">
                Analyse
              </div>
              <nav className="flex flex-col gap-1">
                {sidebarNavItems.map((item) => (
                  <NavItem
                    key={item.title}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href}
                  />
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground">
                Outils
              </div>
              <nav className="flex flex-col gap-1">
                <NavItem
                  href="/analytics/tools/export"
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Exportation"
                  isActive={pathname === "/analytics/tools/export"}
                />
                <NavItem
                  href="/analytics/tools/settings"
                  icon={<Settings className="h-4 w-4" />}
                  title="Paramètres"
                  isActive={pathname === "/analytics/tools/settings"}
                />
              </nav>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground">
                Aide
              </div>
              <div className="flex flex-col gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Documentation</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Consulter la documentation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>FAQ</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Questions fréquemment posées</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
                      >
                        <LifeBuoy className="h-4 w-4" />
                        <span>Support</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Contacter le support</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
