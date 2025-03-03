"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ActivityDetails from "@/components/_organisms/ActivityDetails";
import { Activity, ActivityStatus, RecurrenceType } from "@/types";
import { mockData } from "@/mocks/mockData";

/**
 * Page de détails d'une activité
 */
const OfferDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Créer une activité par défaut au cas où aucune n'est trouvée
        const defaultActivity: Activity = {
          id: params.id as string,
          title: "Cours de cuisine française",
          description: "Apprenez à cuisiner comme un chef français",
          shortDescription: "Cours de cuisine française",
          fullDescription:
            "Découvrez les secrets de la cuisine française avec notre chef étoilé. Au programme : entrée, plat et dessert typiquement français.",
          price: 89,
          currency: "EUR",
          durationMinutes: 180,
          minParticipants: 2,
          maxParticipants: 8,
          providerId: "prov-1",
          providerName: "École de Cuisine Paris",
          categoryIds: ["cat-1"],
          category: "Cuisine",
          status: "published",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          location: {
            address: "15 rue de la Gastronomie",
            postalCode: "75001",
            city: "Paris",
            country: "France",
            latitude: 48.856614,
            longitude: 2.3522219,
          },
          images: [
            {
              id: "img-1",
              url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
              isMain: true,
              alt: "Chef préparant un plat",
            },
            {
              id: "img-2",
              url: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf",
              isMain: false,
              alt: "Ingrédients de cuisine",
            },
            {
              id: "img-3",
              url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
              isMain: false,
              alt: "Plat terminé",
            },
          ],
          averageRating: 4.7,
          reviewCount: 24,
          bookingCount: 156,
          recurrence: {
            type: "weekly" as RecurrenceType,
            startDate: new Date().toISOString(),
            daysOfWeek: [1, 3, 5],
            endDate: new Date(
              new Date().setMonth(new Date().getMonth() + 3)
            ).toISOString(),
            occurrences: 36,
          },
          occurrences: [
            {
              id: "occ-1",
              activityId: params.id as string,
              startDateTime: new Date().toISOString(),
              endDateTime: new Date(
                new Date().setHours(new Date().getHours() + 3)
              ).toISOString(),
              availableSpots: 6,
              totalSpots: 8,
              hasPromotion: false,
              status: "available",
            },
            {
              id: "occ-2",
              activityId: params.id as string,
              startDateTime: new Date(
                new Date().setDate(new Date().getDate() + 2)
              ).toISOString(),
              endDateTime: new Date(
                new Date().setDate(new Date().getDate() + 2)
              ).toISOString(),
              availableSpots: 4,
              totalSpots: 8,
              hasPromotion: true,
              promotionPercentage: 15,
              status: "available",
            },
          ],
        };

        // Rechercher l'activité dans les données mockées
        const matchingActivity = mockData.activities.find(
          (a) => a.id === params.id
        );

        if (matchingActivity) {
          // Si une activité correspondante est trouvée, utiliser ses données
          const matchingService = mockData.services.find(
            (s) => s.id === matchingActivity.id
          );

          // Créer une activité avec les données de l'activité trouvée
          const foundActivity: Activity = {
            ...matchingActivity,
            shortDescription: matchingActivity.description.substring(0, 100),
            fullDescription: matchingActivity.description,
            durationMinutes: matchingService?.duration || 60,
            minParticipants: matchingService?.minParticipants || 1,
            maxParticipants: matchingService?.maxParticipants || 10,
            categoryIds: matchingActivity.categoryIds || [],
            category: matchingService?.type || "Autre",
            providerId: matchingActivity.providerId,
            providerName: matchingActivity.providerName,
            averageRating: matchingService?.rating || 0,
            reviewCount: matchingService?.reviewsCount || 0,
            bookingCount: 0,
            recurrence: {
              type: "weekly" as RecurrenceType,
              startDate: new Date().toISOString(),
              daysOfWeek: [1, 3, 5],
              endDate: new Date(
                new Date().setMonth(new Date().getMonth() + 3)
              ).toISOString(),
              occurrences: 36,
            },
            occurrences: [
              {
                id: `occ-${matchingActivity.id}-1`,
                activityId: matchingActivity.id,
                startDateTime: new Date().toISOString(),
                endDateTime: new Date(
                  new Date().setHours(new Date().getHours() + 3)
                ).toISOString(),
                availableSpots: 6,
                totalSpots: 8,
                hasPromotion: false,
                status: "available",
              },
              {
                id: `occ-${matchingActivity.id}-2`,
                activityId: matchingActivity.id,
                startDateTime: new Date(
                  new Date().setDate(new Date().getDate() + 2)
                ).toISOString(),
                endDateTime: new Date(
                  new Date().setDate(new Date().getDate() + 2)
                ).toISOString(),
                availableSpots: 4,
                totalSpots: 8,
                hasPromotion: true,
                promotionPercentage: 15,
                status: "available",
              },
            ],
          };

          setActivity(foundActivity);
        } else {
          // Sinon, utiliser l'activité par défaut
          setActivity(defaultActivity);
        }

        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement de l'activité");
        setLoading(false);
        console.error(err);
      }
    };

    fetchActivity();
  }, [params.id]);

  const handleBack = () => router.push("/offres");

  const handleEdit = () => {
    // Rediriger vers la page d'édition
    router.push(`/offres/${params.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Rediriger vers la liste des offres
      router.push("/offres");
    } catch (err) {
      console.error(err);
      // Afficher une notification d'erreur
    }
  };

  const handleApprove = async () => {
    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mettre à jour le statut localement
      if (activity) {
        setActivity({
          ...activity,
          status: "published" as ActivityStatus,
        });
      }
    } catch (err) {
      console.error(err);
      // Afficher une notification d'erreur
    }
  };

  const handleReject = async (_activityId: string, reason: string) => {
    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mettre à jour le statut localement
      if (activity) {
        setActivity({
          ...activity,
          status: "rejected" as ActivityStatus,
        });
      }
      console.log("Raison du rejet:", reason);
    } catch (err) {
      console.error(err);
      // Afficher une notification d'erreur
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error || !activity) {
    return <div>Erreur: {error || "Activité non trouvée"}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ActivityDetails
        activity={activity}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default OfferDetailsPage;
