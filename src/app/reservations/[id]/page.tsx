"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Composants UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Composants personnalisés
import { ReservationDetails } from "@/components/_organisms/ReservationDetails";

// Types et mocks
import { ReservationNew as Reservation } from "@/mocks/reservationsMocks";
import { useToast } from "@/components/ui/use-toast";

/**
 * Page de détails d'une réservation
 */
export default function ReservationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'ID de la réservation depuis les paramètres de l'URL
  const reservationId = params?.id as string;

  // Charger les données de la réservation
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dans un environnement réel, nous ferions un appel API ici
        // Pour l'instant, nous simulons une réservation
        const mockReservation: Reservation = {
          id: reservationId,
          userId: "user123",
          providerId: "provider456",
          serviceId: "service789",
          date: new Date().toISOString(),
          startTime: "14:00",
          endTime: "15:00",
          status: "confirmed",
          amount: 75.0,
          commission: 7.5,
          paymentStatus: "paid",
          paymentMethod: "card",

          user: {
            id: "user123",
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@example.com",
            phone: "+33612345678",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            createdAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "active",
            reservationsCount: 5,
            totalSpent: 350,
          },
          provider: {
            id: "provider456",
            name: "Aventures Outdoor",
            email: "contact@aventures-outdoor.com",
            phone: "+33687654321",
            avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
            createdAt: new Date(
              Date.now() - 60 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "approved",
            category: "Sport & Aventure",
            location: "Chamonix, France",
            isActive: true,
            reservationsCount: 120,
            revenue: 8500,
            commissionRate: 10,
            rating: 4.8,
            description:
              "Spécialiste des activités sportives et d'aventure en plein air.",
            website: "https://aventures-outdoor.com",
          },
          service: {
            id: "service789",
            providerId: "provider456",
            name: "Randonnée guidée en montagne",
            description: "Une randonnée de 3 heures avec un guide expérimenté",
            price: 35.0,
            duration: 180,
            type: "specific",
            maxParticipants: 10,
            minParticipants: 2,
            location: "Chemin de la Montagne, 74400 Chamonix, France",
            images: [
              "https://images.unsplash.com/photo-1551632811-561732d1e306",
              "https://images.unsplash.com/photo-1522163182402-834f871fd851",
            ],
            rating: 4.8,
            reviewsCount: 124,
            createdAt: new Date(
              Date.now() - 90 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "active",
          },
        };

        setReservation(mockReservation);
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la réservation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId, toast]);

  // Gestionnaire pour l'annulation d'une réservation
  const handleCancel = (reservationId: string, reason: string) => {
    toast({
      title: "Réservation annulée",
      description: `La réservation a été annulée. Raison: ${reason}`,
    });

    // Mettre à jour l'état local
    if (reservation) {
      setReservation({
        ...reservation,
        status: "cancelled",
      });
    }
  };

  // Gestionnaire pour le remboursement d'une réservation
  const handleRefund = (
    reservationId: string,
    amount: number,
    reason: string
  ) => {
    toast({
      title: "Remboursement effectué",
      description: `Un remboursement de ${amount}€ a été effectué. Raison: ${reason}`,
    });

    // Mettre à jour l'état local
    if (reservation) {
      setReservation({
        ...reservation,
        paymentStatus: "refunded",
        refundAmount: amount,
        cancellationReason: reason,
      });
    }
  };

  // Gestionnaire pour la confirmation d'une réservation
  const handleConfirm = (reservationId: string) => {
    toast({
      title: "Réservation confirmée",
      description: "La réservation a été confirmée avec succès",
    });

    // Mettre à jour l'état local
    if (reservation && reservationId === reservation.id) {
      setReservation({
        ...reservation,
        status: "confirmed",
      });
    }
  };

  // Gestionnaire pour marquer une réservation comme terminée
  const handleComplete = (reservationId: string) => {
    toast({
      title: "Réservation terminée",
      description: "La réservation a été marquée comme terminée",
    });

    // Mettre à jour l'état local
    if (reservation && reservationId === reservation.id) {
      setReservation({
        ...reservation,
        status: "completed",
      });
    }
  };

  // Gestionnaire pour l'envoi d'un message
  const handleSendMessage = (reservationId: string, message: string) => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
    });
    console.log(
      `Message envoyé pour la réservation ${reservationId}: ${message}`
    );
  };

  // Gestionnaire pour le téléchargement de la facture
  const handleDownloadInvoice = (reservationId: string) => {
    toast({
      title: "Téléchargement de la facture",
      description: "Le téléchargement de la facture a commencé",
    });
    console.log(
      `Téléchargement de la facture pour la réservation ${reservationId}`
    );
  };

  // Gestionnaire pour l'impression de la facture
  const handlePrintInvoice = (reservationId: string) => {
    toast({
      title: "Impression de la facture",
      description: "La facture a été envoyée à l'imprimante",
    });
    console.log(
      `Impression de la facture pour la réservation ${reservationId}`
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/reservations")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p>Chargement des détails de la réservation...</p>
          </CardContent>
        </Card>
      ) : !reservation ? (
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p>Réservation non trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <ReservationDetails
          reservation={reservation}
          onCancel={handleCancel}
          onRefund={handleRefund}
          onConfirm={handleConfirm}
          onComplete={handleComplete}
          onSendMessage={handleSendMessage}
          onDownloadInvoice={handleDownloadInvoice}
          onPrintInvoice={handlePrintInvoice}
        />
      )}
    </div>
  );
}
