/**
 * Composant Avatar - Affiche l'avatar d'un utilisateur
 */

import React from "react";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant Avatar
 */
export interface AvatarProps {
  /** URL de l'image de l'avatar */
  src?: string;
  /** Texte alternatif pour l'image */
  alt?: string;
  /** Texte à afficher si l'image n'est pas disponible */
  fallback?: string;
  /** Taille de l'avatar (en pixels) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant Avatar - Affiche l'avatar d'un utilisateur
 */
const Avatar = ({
  src,
  alt = "Avatar",
  fallback = "",
  size = "md",
  className,
}: AvatarProps) => {
  // Détermine les classes CSS en fonction de la taille
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  // Génère les initiales à partir du fallback
  const initials = fallback
    ? fallback
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "";

  return (
    <ShadcnAvatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{initials}</AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;
