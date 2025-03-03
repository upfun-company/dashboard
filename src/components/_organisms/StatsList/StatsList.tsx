import React from "react";
import { cn } from "@/lib/utils";
import StatCard, { StatCardProps } from "@/components/_molecules/StatCard";
import { LucideIcon } from "lucide-react";

export interface Stat {
  /**
   * Identifiant unique de la statistique
   */
  id: string;

  /**
   * Titre de la statistique
   */
  title: string;

  /**
   * Valeur de la statistique
   */
  value: string | number;

  /**
   * Pourcentage de changement (optionnel)
   */
  change?: number;

  /**
   * Période de comparaison (ex: "depuis le mois dernier")
   */
  period?: string;

  /**
   * Icône à afficher
   */
  icon: LucideIcon;

  /**
   * Couleur de l'icône
   */
  iconColor?: StatCardProps["iconColor"];
}

export interface StatsListProps {
  /**
   * Liste des statistiques à afficher
   */
  stats: Stat[];

  /**
   * Classes CSS additionnelles
   */
  className?: string;

  /**
   * Fonction appelée lors du clic sur une statistique
   */
  onStatClick?: (statId: string) => void;
}

/**
 * Composant pour afficher une liste de statistiques sous forme de cartes
 */
const StatsList: React.FC<StatsListProps> = ({
  stats,
  className,
  onStatClick,
}) => {
  if (!stats || stats.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-gray-500">Aucune statistique disponible</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          period={stat.period}
          icon={stat.icon}
          iconColor={stat.iconColor}
          className="h-full transition-transform hover:scale-[1.02]"
          onClick={onStatClick ? () => onStatClick(stat.id) : undefined}
        />
      ))}
    </div>
  );
};

export default StatsList;
