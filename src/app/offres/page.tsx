"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { fetchActivities } from "@/redux/actions/activitiesActions";
import ActivitiesList from "@/components/_organisms/ActivitiesList";
import { Activity, ActivityStatus } from "@/types";
import { Service } from "@/mocks/reservationsMocks";

/**
 * Page de gestion des offres/activités
 */
export default function OffresPage() {
  const router = useRouter();

  // État local pour la pagination et les filtres
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ActivityStatus>(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);

  // Données fictives pour le développement
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  // Catégories disponibles
  const availableCategories = [
    "Cuisine",
    "Culture",
    "Gastronomie",
    "Loisirs",
    "Art",
    "Sport",
    "Bien-être",
  ];

  // Fonction pour charger les activités avec useCallback
  const loadActivities = useCallback(() => {
    setIsLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      // Dans un environnement réel, on utiliserait :
      // dispatch(fetchActivities({
      //   page,
      //   limit,
      //   search: searchTerm,
      //   status: statusFilter,
      //   category: categoryFilter,
      //   sortBy: sortField,
      //   sortDirection
      // }));

      // Données fictives pour le développement
      import("@/mocks/mockData").then(({ mockData }) => {
        // Générer des IDs uniques pour les activités par défaut
        const activityId1 = crypto.randomUUID();
        const activityId2 = crypto.randomUUID();

        const defaultActivities: Activity[] = [
          {
            id: activityId1,
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
              latitude: 48.8566,
              longitude: 2.3522,
            },
            images: [
              {
                id: "img-1",
                url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                isMain: true,
                alt: "Cours de cuisine française",
              },
            ],
            averageRating: 4.8,
            reviewCount: 24,
            bookingCount: 156,
          },
          {
            id: activityId2,
            title: "Atelier de poterie",
            description: "Créez votre propre poterie",
            shortDescription: "Atelier de poterie",
            fullDescription:
              "Venez découvrir l'art de la poterie dans notre atelier. Vous repartirez avec votre création personnelle après 2h de cours.",
            price: 65,
            currency: "EUR",
            durationMinutes: 120,
            minParticipants: 1,
            maxParticipants: 6,
            providerId: "prov-2",
            providerName: "Atelier Terre & Feu",
            categoryIds: ["cat-2"],
            category: "Art",
            status: "published",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            location: {
              address: "8 rue des Artisans",
              postalCode: "75011",
              city: "Paris",
              country: "France",
              latitude: 48.8607,
              longitude: 2.3789,
            },
            images: [
              {
                id: "img-2",
                url: "https://images.unsplash.com/photo-1565122644474-5edd4c5e3f2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                isMain: true,
                alt: "Atelier de poterie",
              },
            ],
            averageRating: 4.6,
            reviewCount: 18,
            bookingCount: 87,
          },
        ];

        // Ajouter un troisième exemple d'activité
        defaultActivities.push({
          id: crypto.randomUUID(),
          title: "Randonnée en montagne",
          description: "Découvrez les plus beaux paysages de montagne",
          shortDescription: "Randonnée guidée",
          fullDescription:
            "Une journée complète de randonnée avec un guide expérimenté qui vous fera découvrir les plus beaux sentiers et panoramas de la région.",
          price: 45,
          currency: "EUR",
          durationMinutes: 360,
          minParticipants: 4,
          maxParticipants: 12,
          providerId: "prov-3",
          providerName: "Aventures Nature",
          categoryIds: ["cat-3"],
          category: "Sport",
          status: "published",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          location: {
            address: "Route des Montagnes",
            postalCode: "74000",
            city: "Chamonix",
            country: "France",
            latitude: 45.9237,
            longitude: 6.8694,
          },
          images: [
            {
              id: "img-3",
              url: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              isMain: true,
              alt: "Randonnée en montagne",
            },
          ],
          averageRating: 4.9,
          reviewCount: 32,
          bookingCount: 124,
        });

        // Convertir les services en activités ou utiliser les activités par défaut si aucun service n'est disponible
        const servicesData = mockData.services || [];

        // Si aucun service n'est disponible, utiliser les activités par défaut
        const convertedActivities: Activity[] =
          servicesData.length > 0
            ? servicesData.map(
                (service: Service) =>
                  ({
                    id: service.id || crypto.randomUUID(),
                    title: service.name || "Sans titre",
                    description: service.description || "",
                    shortDescription: service.description || "",
                    fullDescription: service.description || "",
                    price: service.price || 0,
                    currency: "EUR",
                    durationMinutes: service.duration || 60,
                    minParticipants: service.minParticipants || 1,
                    maxParticipants: service.maxParticipants || 10,
                    providerId: service.providerId || "unknown",
                    providerName:
                      service.provider?.name || "Prestataire inconnu",
                    category: service.type || "Non catégorisé",
                    status: "published" as ActivityStatus,
                    createdAt: service.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    location: {
                      address: service.location || "",
                      postalCode: "",
                      city: "",
                      country: "France",
                      latitude: service.latitude,
                      longitude: service.longitude,
                    },
                    images:
                      service.images && service.images.length > 0
                        ? [
                            {
                              id: "img-1",
                              url: service.images[0],
                              isMain: true,
                              alt: service.name || "Image de l'activité",
                            },
                          ]
                        : [
                            {
                              id: "img-default",
                              url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                              isMain: true,
                              alt: "Image par défaut",
                            },
                          ],
                    averageRating: service.rating || 4.5,
                    reviewCount: service.reviewsCount || 0,
                    bookingCount: 0,
                  } as Activity)
              )
            : defaultActivities;

        let filtered = [...convertedActivities];

        // Filtrage par statut
        if (statusFilter !== "all") {
          filtered = filtered.filter(
            (activity: Activity) => activity.status === statusFilter
          );
        }

        // Filtrage par catégorie
        if (categoryFilter !== "all") {
          filtered = filtered.filter(
            (activity: Activity) => activity.category === categoryFilter
          );
        }

        // Filtrage par recherche
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (activity: Activity) =>
              activity.title.toLowerCase().includes(searchLower) ||
              activity.description.toLowerCase().includes(searchLower)
          );
        }

        // Tri des activités selon le champ et la direction spécifiés
        filtered.sort((a, b) => {
          // Gestion des différents types de champs pour le tri
          if (sortField === "price") {
            return sortDirection === "asc"
              ? a.price - b.price
              : b.price - a.price;
          } else if (sortField === "createdAt") {
            return sortDirection === "asc"
              ? new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
          } else if (sortField === "title") {
            return sortDirection === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          } else if (sortField === "averageRating") {
            return sortDirection === "asc"
              ? (a.averageRating || 0) - (b.averageRating || 0)
              : (b.averageRating || 0) - (a.averageRating || 0);
          } else {
            // Par défaut, tri par date de création
            return sortDirection === "asc"
              ? new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
          }
        });

        setActivities(convertedActivities);
        setFilteredActivities(filtered);
        setTotalActivities(filtered.length);
        setIsLoading(false);
      });
    }, 1000);
  }, [searchTerm, statusFilter, categoryFilter, sortField, sortDirection]);

  // Chargement initial des données
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

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
  const handleStatusFilter = (status: "all" | ActivityStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Gestion du filtrage par catégorie
  const handleCategoryFilter = (category: string | "all") => {
    setCategoryFilter(category);
    setPage(1);
  };

  // Gestion du tri
  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Navigation vers la page de détails
  const handleViewDetails = (activityId: string) => {
    router.push(`/offres/${activityId}`);
  };

  // Navigation vers la page d'édition
  const handleEdit = (activityId: string) => {
    router.push(`/offres/${activityId}/edit`);
  };

  // Suppression d'une activité
  const handleDelete = (activityId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(deleteActivity(activityId));

    // Pour le développement, on simule la suppression
    setActivities(activities.filter((activity) => activity.id !== activityId));
    setTotalActivities(totalActivities - 1);
  };

  // Approbation d'une activité
  const handleApprove = (activityId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(approveActivity(activityId));

    // Pour le développement, on simule l'approbation
    setActivities(
      activities.map((activity) =>
        activity.id === activityId
          ? { ...activity, status: "published" as ActivityStatus }
          : activity
      )
    );
  };

  // Rejet d'une activité
  const handleReject = (activityId: string) => {
    // Dans un environnement réel, on utiliserait :
    // dispatch(rejectActivity({ activityId, reason }));

    // Pour le développement, on simule le rejet
    setActivities(
      activities.map((activity) =>
        activity.id === activityId
          ? { ...activity, status: "rejected" as ActivityStatus }
          : activity
      )
    );
  };

  // Création d'une nouvelle activité
  const handleCreateActivity = () => {
    router.push("/offres/create");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des offres</h1>
      <p className="text-muted-foreground">
        Gérez les activités proposées par les prestataires
      </p>

      <ActivitiesList
        activities={filteredActivities}
        pagination={{
          page,
          limit,
          total: totalActivities,
        }}
        isLoading={isLoading}
        availableCategories={availableCategories}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onCategoryFilter={handleCategoryFilter}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={(id) => handleReject(id)}
        onCreateActivity={handleCreateActivity}
      />
    </div>
  );
}
