/**
 * Types généraux utilisés dans toute l'application
 */

/**
 * Props générales qui peuvent être appliquées à la plupart des composants
 */
export interface GeneralProps {
  /** Nom de classe CSS */
  className?: string;
  /** ID de l'élément */
  id?: string;
}

/**
 * Type pour les données de pagination
 */
export interface PaginationData {
  /** Page actuelle */
  page: number;
  /** Nombre d'éléments par page */
  limit: number;
  /** Nombre total d'éléments */
  total: number;
}

/**
 * Type pour les réponses paginées de l'API
 */
export interface PaginatedResponse<T> {
  /** Données de la réponse */
  data: T[];
  /** Informations de pagination */
  pagination: PaginationData;
}

/**
 * Type pour les options de filtrage
 */
export interface FilterOptions {
  /** Terme de recherche */
  search?: string;
  /** Champ de tri */
  sortBy?: string;
  /** Direction de tri (asc/desc) */
  sortDirection?: "asc" | "desc";
  /** Filtres supplémentaires spécifiques */
  [key: string]: unknown;
}
