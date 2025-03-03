/**
 * Composant EventCard - Affiche un événement récent
 */

import React from "react";
import {
  Calendar,
  User,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Star,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant EventCard
 */
export interface EventCardProps {
  /** Type d'événement */
  type:
    | "reservation"
    | "user"
    | "provider"
    | "payment"
    | "message"
    | "review"
    | "system";
  /** Titre de l'événement */
  title: string;
  /** Description de l'événement (optionnel) */
  description?: string;
  /** Date de l'événement (formatée) */
  date: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée lors du clic sur l'événement */
  onClick?: () => void;
}

/**
 * Composant EventCard - Affiche un événement récent
 */
const EventCard = ({
  type,
  title,
  description,
  date,
  className,
  onClick,
}: EventCardProps) => {
  // Détermine l'icône en fonction du type d'événement
  const getIcon = () => {
    switch (type) {
      case "reservation":
        return <ShoppingCart className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "provider":
        return <User className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "system":
        return <Activity className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Détermine la couleur de l'icône en fonction du type d'événement
  const getIconColor = () => {
    switch (type) {
      case "reservation":
        return "text-blue-500 bg-blue-100";
      case "user":
        return "text-green-500 bg-green-100";
      case "provider":
        return "text-purple-500 bg-purple-100";
      case "payment":
        return "text-emerald-500 bg-emerald-100";
      case "message":
        return "text-amber-500 bg-amber-100";
      case "review":
        return "text-orange-500 bg-orange-100";
      case "system":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("p-2 rounded-full", getIconColor())}>{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {date}
      </div>
    </div>
  );
};

export default EventCard;
