"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ProviderDetails from "@/components/_organisms/ProviderDetails/ProviderDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { extendProvider } from "@/types/providerExtended";
import { Provider } from "@/types";
import { ProviderExtended } from "@/types/providerExtended";

// Cette fonction serait remplacée par un appel API réel
function getMockProviderData(id: string): ProviderExtended {
  // Données fictives pour la démonstration
  const baseProvider: Provider = {
    id,
    name: "Aventure Outdoor",
    email: "contact@aventure-outdoor.fr",
    phone: "+33 6 12 34 56 78",
    location: "Annecy, France",
    status: "approved",
    isActive: true,
    createdAt: "2023-01-15T10:30:00Z",
    category: "Activités de plein air",
    description:
      "Spécialiste des activités de plein air dans la région d'Annecy. Nous proposons des randonnées, du parapente, du canyoning et bien d'autres activités.",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    website: "https://aventure-outdoor.fr",
  };

  // Étendre le provider avec les données supplémentaires
  const extendedProvider = extendProvider(baseProvider);

  // Ajouter des activités au format attendu
  extendedProvider.activities = [
    {
      id: "a1",
      title: "Randonnée en montagne",
      description: "Une randonnée guidée dans les montagnes d'Annecy",
      price: 45,
      duration: "3h",
      category: "Randonnée",
      isActive: true,
      bookingsCount: 24,
      rating: 4.8,
    },
    {
      id: "a2",
      title: "Parapente",
      description: "Vol en parapente avec un instructeur certifié",
      price: 120,
      duration: "1h",
      category: "Vol",
      isActive: true,
      bookingsCount: 18,
      rating: 4.9,
    },
    {
      id: "a3",
      title: "Canyoning",
      description: "Descente de canyon avec équipement fourni",
      price: 85,
      duration: "4h",
      category: "Eau",
      isActive: true,
      bookingsCount: 12,
      rating: 4.7,
    },
  ];

  // Ajouter des réservations au format attendu
  extendedProvider.reservations = [
    {
      id: "r1",
      customerName: "Jean Dupont",
      activityTitle: "Randonnée en montagne",
      date: "2023-06-15T09:00:00Z",
      status: "completed",
      amount: 45,
      participants: 1,
    },
    {
      id: "r2",
      customerName: "Marie Martin",
      activityTitle: "Parapente",
      date: "2023-06-16T14:00:00Z",
      status: "confirmed",
      amount: 120,
      participants: 1,
    },
    {
      id: "r3",
      customerName: "Pierre Durand",
      activityTitle: "Canyoning",
      date: "2023-06-17T10:00:00Z",
      status: "cancelled",
      amount: 85,
      participants: 2,
    },
  ];

  // Ajouter des avis au format attendu
  extendedProvider.reviews = [
    {
      id: "rev1",
      customerName: "Jean Dupont",
      activityTitle: "Randonnée en montagne",
      rating: 5,
      comment: "Superbe expérience, guide très professionnel !",
      date: "2023-06-16T18:00:00Z",
    },
    {
      id: "rev2",
      customerName: "Marie Martin",
      activityTitle: "Parapente",
      rating: 5,
      comment: "Sensations incroyables, je recommande vivement !",
      date: "2023-06-17T19:30:00Z",
    },
    {
      id: "rev3",
      customerName: "Sophie Lefebvre",
      activityTitle: "Canyoning",
      rating: 4,
      comment: "Très bonne activité, un peu physique mais accessible.",
      date: "2023-06-18T12:15:00Z",
    },
  ];

  return extendedProvider;
}

export default function ProviderDetailsPage() {
  const params = useParams();
  const providerId = params.id as string;
  const [provider, setProvider] = useState<ProviderExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simuler un appel API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = getMockProviderData(providerId);
        setProvider(data);
        setError(false);
      } catch (err) {
        console.error("Erreur lors de la récupération du prestataire:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/prestataires">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détails du prestataire</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/prestataires">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails du prestataire</h1>
      </div>

      <ProviderDetails
        provider={provider}
        onBack={() => {}}
        onEdit={(provider) =>
          console.log(`Éditer le prestataire: ${provider.id}`)
        }
        onDelete={(providerId) =>
          console.log(`Supprimer le prestataire: ${providerId}`)
        }
        onApprove={(provider) =>
          console.log(`Approuver le prestataire: ${provider.id}`)
        }
        onReject={(provider) =>
          console.log(`Rejeter le prestataire: ${provider.id}`)
        }
        onViewDocuments={() => {}}
      />
    </div>
  );
}
