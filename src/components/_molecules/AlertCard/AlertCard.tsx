/**
 * Composant AlertCard - Affiche une alerte avec un niveau de sévérité
 */

import React from "react";
import {
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant AlertCard
 */
export interface AlertCardProps {
  /** Type d'alerte */
  type: "info" | "warning" | "error" | "success";
  /** Message de l'alerte */
  message: string;
  /** Titre de l'alerte (optionnel) */
  title?: string;
  /** Date de l'alerte (optionnel) */
  date?: string;
  /** Action à effectuer (optionnel) */
  action?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée lors du clic sur l'alerte */
  onClick?: () => void;
}

/**
 * Composant AlertCard - Affiche une alerte avec un niveau de sévérité
 */
const AlertCard = ({
  type = "info",
  message,
  title,
  date,
  action,
  className,
  onClick,
}: AlertCardProps) => {
  // Détermine l'icône en fonction du type d'alerte
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Détermine la variante de l'alerte en fonction du type
  const getVariant = () => {
    switch (type) {
      case "info":
        return "info";
      case "warning":
        return "warning";
      case "error":
        return "destructive";
      case "success":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Alert
      variant={getVariant()}
      className={cn(
        "cursor-default transition-all duration-200 shadow-sm",
        onClick && "cursor-pointer hover:opacity-90 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {title && (
            <AlertTitle className="text-base font-semibold">{title}</AlertTitle>
          )}
          <AlertDescription className="mt-1">{message}</AlertDescription>
          {date && <p className="mt-2 text-xs text-muted-foreground">{date}</p>}
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </div>
    </Alert>
  );
};

export default AlertCard;
