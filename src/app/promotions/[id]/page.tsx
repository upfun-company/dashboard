"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import type { RootState } from "@/redux/rootReducer";
// import { fetchPromotionById } from "@/redux/actions/promotionsActions";
import PromotionDetails from "@/components/_organisms/PromotionDetails";
import { Promotion } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Page de détails d'une promotion
 */
export default function PromotionPage() {
  // Utiliser React.use() pour déballer les paramètres
  const params = useParams();
  const promotionId = params.id as string;

  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<
    | {
        totalRevenue: number;
        totalDiscountAmount: number;
        usageByDay: Array<{
          date: string;
          count: number;
          discountAmount: number;
        }>;
        usageByUser?: Array<{
          userId: string;
          userName: string;
          usageCount: number;
          lastUsed: string;
        }>;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    // Simulation d'un appel API
    setIsLoading(true);
    setTimeout(() => {
      // Dans un environnement réel, on utiliserait :
      // dispatch(fetchPromotionById(promotionId));

      // Pour le développement, on simule le chargement
      import("@/mocks").then(({ promotionsMocks }) => {
        const foundPromotion = promotionsMocks.promotions.find(
          (promo) => promo.id === promotionId
        );

        if (foundPromotion) {
          setPromotion(foundPromotion as Promotion);

          // Statistiques d'utilisation fictives
          setUsageStats({
            totalRevenue: 12500,
            totalDiscountAmount: 2350,
            usageByDay: [
              { date: "2023-06-01", count: 5, discountAmount: 125 },
              { date: "2023-06-02", count: 8, discountAmount: 200 },
              { date: "2023-06-03", count: 12, discountAmount: 300 },
              { date: "2023-06-04", count: 15, discountAmount: 375 },
              { date: "2023-06-05", count: 10, discountAmount: 250 },
              { date: "2023-06-06", count: 18, discountAmount: 450 },
              { date: "2023-06-07", count: 22, discountAmount: 550 },
            ],
            usageByUser: [
              {
                userId: "user-001",
                userName: "Jean Dupont",
                usageCount: 2,
                lastUsed: "2023-06-07T14:30:00Z",
              },
              {
                userId: "user-002",
                userName: "Marie Martin",
                usageCount: 1,
                lastUsed: "2023-06-06T10:15:00Z",
              },
              {
                userId: "user-003",
                userName: "Pierre Durand",
                usageCount: 3,
                lastUsed: "2023-06-07T16:45:00Z",
              },
            ],
          });

          setError(null);
        } else {
          setError("Promotion non trouvée");
        }

        setIsLoading(false);
      });
    }, 500);
  }, [promotionId]);

  // Navigation vers la liste des promotions
  const handleBack = () => {
    router.push("/promotions");
  };

  // Navigation vers la page d'édition
  const handleEdit = () => {
    router.push(`/promotions/${promotionId}/edit`);
  };

  // Suppression de la promotion
  const handleDelete = () => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(deletePromotion(promotionId));

    // Redirection après suppression
    router.push("/promotions");
  };

  // Activation de la promotion
  const handleActivate = () => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(activatePromotion(promotionId));

    // Simulation de l'activation
    if (promotion) {
      setPromotion({ ...promotion, isActive: true });
    }
  };

  // Désactivation de la promotion
  const handleDeactivate = () => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(deactivatePromotion(promotionId));

    // Simulation de la désactivation
    if (promotion) {
      setPromotion({ ...promotion, isActive: false });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Erreur</h1>
        <p className="text-red-500">{error || "Une erreur est survenue"}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PromotionDetails
        promotion={promotion}
        usageStats={usageStats}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}
