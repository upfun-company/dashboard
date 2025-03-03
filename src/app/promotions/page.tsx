"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import type { RootState } from "@/redux/rootReducer";
// import { fetchPromotions } from "@/redux/actions/promotionsActions";
import PromotionsList from "@/components/_organisms/PromotionsList";
import { Promotion } from "@/types";

/**
 * Page de gestion des promotions
 */
export default function PromotionsPage() {
  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>();

  // État local pour la pagination et les filtres
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState<
    "percentage" | "fixed_amount" | "all"
  >("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);

  // Données fictives pour le développement
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [totalPromotions, setTotalPromotions] = useState(0);

  // Type pour les promotions mockées
  type MockPromotion = {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    currentUsageCount: number;
    maxUsageCount: number | null;
    maxUsagePerUser: number | null;
    minOrderAmount: number | null;
    applicableActivities: string[];
    excludedActivities: string[];
    createdAt: string;
    updatedAt: string;
  };

  // Fonction pour charger les promotions (utilisation de useCallback pour éviter les dépendances circulaires)
  const loadPromotions = useCallback(() => {
    setIsLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      // Dans un environnement réel, on utiliserait :
      // dispatch(fetchPromotions({
      //   page,
      //   limit,
      //   search: searchTerm,
      //   status: statusFilter,
      //   discountType: discountTypeFilter,
      //   sortBy: sortField,
      //   sortDirection
      // }));

      // Données fictives pour le développement
      import("@/mocks/promotionsMocks").then(({ promotionsMocks }) => {
        // Conversion explicite des données mockées en type Promotion[]
        const typedPromotions = promotionsMocks.promotions.map(
          (promotion: MockPromotion) => ({
            ...promotion,
            discountType: promotion.discountType as
              | "percentage"
              | "fixed_amount",
            // Conversion explicite de null en undefined si nécessaire
            maxUsageCount:
              promotion.maxUsageCount === null
                ? undefined
                : promotion.maxUsageCount,
            maxUsagePerUser:
              promotion.maxUsagePerUser === null
                ? undefined
                : promotion.maxUsagePerUser,
            minOrderAmount:
              promotion.minOrderAmount === null
                ? undefined
                : promotion.minOrderAmount,
          })
        ) as Promotion[];

        let filteredPromotions = [...typedPromotions];

        // Filtrage par statut
        if (statusFilter !== "all") {
          filteredPromotions = filteredPromotions.filter(
            (promotion) => promotion.isActive === statusFilter
          );
        }

        // Filtrage par type de remise
        if (discountTypeFilter !== "all") {
          filteredPromotions = filteredPromotions.filter(
            (promotion) => promotion.discountType === discountTypeFilter
          );
        }

        // Filtrage par recherche
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredPromotions = filteredPromotions.filter(
            (promotion) =>
              promotion.code.toLowerCase().includes(searchLower) ||
              promotion.description.toLowerCase().includes(searchLower)
          );
        }

        // Tri des promotions selon le champ et la direction spécifiés
        filteredPromotions.sort((a, b) => {
          // Utilisation de sortField et sortDirection pour le tri
          const aValue = a[sortField as keyof Promotion];
          const bValue = b[sortField as keyof Promotion];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (aValue !== undefined && bValue !== undefined) {
            return sortDirection === "asc"
              ? aValue < bValue
                ? -1
                : 1
              : bValue < aValue
              ? -1
              : 1;
          }

          return 0;
        });

        setPromotions(filteredPromotions);
        setTotalPromotions(filteredPromotions.length);
        setIsLoading(false);
      });
    }, 500);
  }, [searchTerm, statusFilter, discountTypeFilter, sortField, sortDirection]);

  // Chargement initial des données
  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement de limite par page
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Réinitialiser à la première page
  };

  // Gestion de la recherche
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  // Gestion du filtrage par statut
  const handleStatusFilter = (status: boolean | "all") => {
    setStatusFilter(status);
    setPage(1);
  };

  // Gestion du filtrage par type de remise
  const handleDiscountTypeFilter = (
    type: "percentage" | "fixed_amount" | "all"
  ) => {
    setDiscountTypeFilter(type);
    setPage(1);
  };

  // Gestion du tri
  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Navigation vers la page de détails
  const handleViewDetails = (promotionId: string) => {
    router.push(`/promotions/${promotionId}`);
  };

  // Navigation vers la page d'édition
  const handleEdit = (promotionId: string) => {
    router.push(`/promotions/${promotionId}/edit`);
  };

  // Suppression d'une promotion
  const handleDelete = (promotionId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(deletePromotion(promotionId));

    // Pour le développement, on simule la suppression
    setPromotions(
      promotions.filter((promotion) => promotion.id !== promotionId)
    );
    setTotalPromotions(totalPromotions - 1);
  };

  // Activation d'une promotion
  const handleActivate = (promotionId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(activatePromotion(promotionId));

    // Pour le développement, on simule l'activation
    setPromotions(
      promotions.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, isActive: true }
          : promotion
      )
    );
  };

  // Désactivation d'une promotion
  const handleDeactivate = (promotionId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(deactivatePromotion(promotionId));

    // Pour le développement, on simule la désactivation
    setPromotions(
      promotions.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, isActive: false }
          : promotion
      )
    );
  };

  // Création d'une nouvelle promotion
  const handleCreatePromotion = () => {
    router.push("/promotions/create");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des promotions</h1>
      <p className="text-muted-foreground">
        Gérez les codes promotionnels et les offres spéciales
      </p>

      <PromotionsList
        promotions={promotions}
        pagination={{
          page,
          limit,
          total: totalPromotions,
        }}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDiscountTypeFilter={handleDiscountTypeFilter}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onCreatePromotion={handleCreatePromotion}
      />
    </div>
  );
}
