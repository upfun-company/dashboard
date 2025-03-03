"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderMock } from "@/mocks/providersMocks";
// Importer les types depuis le composant RecurrenceForm au lieu de @/types
import {
  RecurrenceForm,
  RecurrenceConfig,
  ActivityOccurrence,
} from "@/components/_organisms/RecurrenceForm/RecurrenceForm";

/**
 * Type pour un créneau horaire
 */
interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isPromotion: boolean;
  promotionPercentage?: number;
}

/**
 * Page de création d'une activité
 */
const CreateActivityPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<ProviderMock[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<Omit<TimeSlot, "id">>({
    day: "lundi",
    startTime: "09:00",
    endTime: "10:00",
    capacity: 10,
    isPromotion: false,
    promotionPercentage: 0,
  });

  // État pour la récurrence
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig>({
    type: "none",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
  });

  // État pour les occurrences générées
  const [generatedOccurrences, setGeneratedOccurrences] = useState<
    ActivityOccurrence[]
  >([]);

  // État pour l'activité
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    price: 0,
    duration: 60,
    category: "",
    providerId: "",
    maxParticipants: 10,
    minParticipants: 1,
    location: {
      address: "",
      postalCode: "",
      city: "",
      country: "France",
    },
    images: [] as File[],
    isPublished: false,
  });

  // Chargement des prestataires
  useEffect(() => {
    // Simulation d'un appel API pour récupérer les prestataires
    import("@/mocks/mockData").then(({ mockData }) => {
      if (mockData && mockData.providers) {
        setProviders(mockData.providers);
      }
    });
  }, []);

  // Gestion des changements dans les champs de formulaire
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Conversion des valeurs numériques
    if (
      name === "price" ||
      name === "duration" ||
      name === "maxParticipants" ||
      name === "minParticipants"
    ) {
      setActivity({
        ...activity,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setActivity({
        ...activity,
        [name]: value,
      });
    }
  };

  // Gestion des changements dans les champs de localisation
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setActivity({
      ...activity,
      location: {
        ...activity.location,
        [name]: value,
      },
    });
  };

  // Gestion des changements dans les listes déroulantes
  const handleSelectChange = (name: string, value: string) => {
    setActivity({
      ...activity,
      [name]: value,
    });
  };

  // Gestion des changements dans les champs du nouveau créneau
  const handleTimeSlotChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setNewTimeSlot({
        ...newTimeSlot,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === "capacity" || name === "promotionPercentage") {
      setNewTimeSlot({
        ...newTimeSlot,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setNewTimeSlot({
        ...newTimeSlot,
        [name]: value,
      });
    }
  };

  // Ajout d'un nouveau créneau
  const handleAddTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      ...newTimeSlot,
    };

    setTimeSlots([...timeSlots, newSlot]);

    // Réinitialisation du formulaire de créneau
    setNewTimeSlot({
      day: "lundi",
      startTime: "09:00",
      endTime: "10:00",
      capacity: 10,
      isPromotion: false,
      promotionPercentage: 0,
    });
  };

  // Suppression d'un créneau
  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  // Retour à la liste des offres
  const handleGoBack = () => {
    router.push("/offres");
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Création de l'activité avec les données du formulaire
      const newActivity = {
        ...activity,
        recurrence:
          recurrenceConfig.type !== "none" ? recurrenceConfig : undefined,
        occurrences:
          recurrenceConfig.type !== "none" ? generatedOccurrences : undefined,
      };

      // Simulation d'appel API
      console.log("Création de l'activité:", newActivity);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirection vers la liste des offres
      router.push("/offres");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des changements de configuration de récurrence
  const handleRecurrenceChange = (
    config: RecurrenceConfig,
    occurrences: ActivityOccurrence[]
  ) => {
    setRecurrenceConfig(config);
    setGeneratedOccurrences(occurrences);
  };

  // Liste des jours de la semaine
  const daysOfWeek = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  // Liste des catégories
  const categories = [
    "Sport",
    "Culture",
    "Gastronomie",
    "Loisirs",
    "Art",
    "Bien-être",
    "Cuisine",
  ];

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Créer une nouvelle activité</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="recurrence">Récurrence</TabsTrigger>
            <TabsTrigger value="timeSlots">Créneaux</TabsTrigger>
            <TabsTrigger value="advanced">Options avancées</TabsTrigger>
          </TabsList>

          {/* Onglet Détails */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="providerId">Prestataire *</Label>
                  <Select
                    name="providerId"
                    value={activity.providerId}
                    onValueChange={(value) =>
                      handleSelectChange("providerId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un prestataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    L&apos;activité sera associée à ce prestataire
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={activity.title}
                    onChange={handleInputChange}
                    placeholder="Titre de l'activité"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={activity.description}
                    onChange={handleInputChange}
                    placeholder="Description détaillée de l'activité"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={activity.price}
                      onChange={handleInputChange}
                      placeholder="Prix de l'activité"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="15"
                      step="5"
                      value={activity.duration}
                      onChange={handleInputChange}
                      placeholder="Durée de l'activité"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    name="category"
                    value={activity.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Localisation *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={activity.location.address}
                        onChange={handleLocationChange}
                        placeholder="Adresse"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={activity.location.postalCode}
                        onChange={handleLocationChange}
                        placeholder="Code postal"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        name="city"
                        value={activity.location.city}
                        onChange={handleLocationChange}
                        placeholder="Ville"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        name="country"
                        value={activity.location.country}
                        onChange={handleLocationChange}
                        placeholder="Pays"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Images */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Glissez-déposez des fichiers ici, ou{" "}
                        <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                          parcourez
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF jusqu&apos;à 10MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                    />
                    <Button type="button" variant="outline" size="sm">
                      Sélectionner des fichiers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurrence" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de la récurrence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Définissez si cette activité se répète régulièrement et selon
                  quel schéma. Les occurrences seront automatiquement générées
                  en fonction de la configuration.
                </p>

                <RecurrenceForm
                  initialConfig={recurrenceConfig}
                  activityDuration={activity.duration}
                  maxCapacity={activity.maxParticipants}
                  onChange={handleRecurrenceChange}
                  activityId={`new-activity-${Date.now()}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Créneaux horaires */}
          <TabsContent value="timeSlots">
            <Card>
              <CardHeader>
                <CardTitle>Créneaux horaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    Ajouter un créneau
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="day">Jour</Label>
                      <Select
                        name="day"
                        value={newTimeSlot.day}
                        onValueChange={(value) =>
                          setNewTimeSlot({ ...newTimeSlot, day: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Jour de la semaine" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Heure de début</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={newTimeSlot.startTime}
                        onChange={handleTimeSlotChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Heure de fin</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={newTimeSlot.endTime}
                        onChange={handleTimeSlotChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacité</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        value={newTimeSlot.capacity}
                        onChange={handleTimeSlotChange}
                        required
                      />
                    </div>

                    <div className="space-y-2 flex items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isPromotion"
                          name="isPromotion"
                          checked={newTimeSlot.isPromotion}
                          onCheckedChange={(checked) =>
                            setNewTimeSlot({
                              ...newTimeSlot,
                              isPromotion: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="isPromotion">
                          Appliquer une promotion
                        </Label>
                      </div>
                    </div>
                  </div>

                  {newTimeSlot.isPromotion && (
                    <div className="mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="promotionPercentage">
                          Pourcentage de réduction
                        </Label>
                        <Input
                          id="promotionPercentage"
                          name="promotionPercentage"
                          type="number"
                          min="1"
                          max="100"
                          value={newTimeSlot.promotionPercentage}
                          onChange={handleTimeSlotChange}
                          required={newTimeSlot.isPromotion}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="w-full"
                  >
                    Ajouter ce créneau
                  </Button>
                </div>

                {timeSlots.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Créneaux ajoutés</h3>
                    <div className="border rounded-lg divide-y">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">
                              {slot.day.charAt(0).toUpperCase() +
                                slot.day.slice(1)}{" "}
                              : {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              Capacité: {slot.capacity} personnes
                              {slot.isPromotion &&
                                ` • Promotion: ${slot.promotionPercentage}% de réduction`}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveTimeSlot(slot.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucun créneau ajouté. Veuillez ajouter au moins un créneau
                    horaire.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Options avancées */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Options avancées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minParticipants">
                      Nombre minimum de participants
                    </Label>
                    <Input
                      id="minParticipants"
                      name="minParticipants"
                      type="number"
                      min="1"
                      value={activity.minParticipants}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">
                      Nombre maximum de participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={activity.maxParticipants}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="isPublished"
                    checked={activity.isPublished}
                    onCheckedChange={(checked) =>
                      setActivity({
                        ...activity,
                        isPublished: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isPublished">
                    Publier immédiatement (sinon, l&apos;activité sera en
                    attente de validation)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleGoBack}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer l&apos;activité"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityPage;
