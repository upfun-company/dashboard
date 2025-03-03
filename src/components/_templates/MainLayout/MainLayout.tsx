"use client";

/**
 * Composant MainLayout - Template principal pour la mise en page du dashboard
 */

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Layers,
  Bell,
  LogOut,
  Menu as MenuIcon,
  ChevronLeft,
  DollarSign,
  Shield,
  Tag,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Props pour le composant MainLayout
 */
interface MainLayoutProps {
  /** Contenu principal */
  children: ReactNode;
  /** Titre de la page */
  pageTitle: string;
  /** Nombre de notifications */
  notificationCount?: number;
  /** Fonction de déconnexion */
  onLogout?: () => void;
  /** Utilisateur connecté */
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Éléments de navigation
 */
const navigationItems = [
  { text: "Vue d'ensemble", icon: <LayoutDashboard size={20} />, path: "/" },
  { text: "Prestataires", icon: <Users size={20} />, path: "/prestataires" },
  { text: "Clients", icon: <Users size={20} />, path: "/clients" },
  {
    text: "Réservations",
    icon: <CalendarClock size={20} />,
    path: "/reservations",
  },
  { text: "Offres", icon: <Tag size={20} />, path: "/offres" },
  { text: "Promotions", icon: <Gift size={20} />, path: "/promotions" },
  { text: "Finance", icon: <DollarSign size={20} />, path: "/finance" },
  { text: "Analyses", icon: <Layers size={20} />, path: "/analytics" },
  { text: "Sécurité", icon: <Shield size={20} />, path: "/security" },
];

/**
 * Composant MainLayout - Template principal pour la mise en page du dashboard
 */
const MainLayout = ({
  children,
  pageTitle,
  notificationCount = 0,
  onLogout,
  user = { name: "Admin", role: "Administrateur" },
  className,
}: MainLayoutProps) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Détection du mode mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar pour desktop */}
      {!isMobile && (
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">upfun</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Sidebar pour mobile */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="h-16 border-b px-4">
              <SheetTitle className="flex items-center">
                <span className="text-xl font-bold text-primary">upfun</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      )}

      {/* Contenu principal */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          sidebarOpen && !isMobile ? "lg:ml-64" : ""
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-card px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              {isMobile ? (
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <MenuIcon size={20} />
                  </Button>
                </SheetTrigger>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mr-2"
                >
                  <MenuIcon size={20} />
                </Button>
              )}
              <h1 className="text-xl font-semibold">{pageTitle}</h1>
            </div>

            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell size={20} />
                      {notificationCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]"
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Menu utilisateur */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex w-full items-center">
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={onLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          <div className={cn("mx-auto max-w-7xl", className)}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
