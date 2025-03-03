import { createAsyncThunk } from "@reduxjs/toolkit";
import { Activity, ActivityStatus } from "@/types/activities";
import { PaginatedResponse } from "@/types/general";
import {
  setActivitiesWithPagination,
  setLoading,
  setError,
  updateActivity as updateActivityAction,
  deleteActivity as deleteActivityAction,
} from "../reducers/activitiesReducer";

// Pour le moment, nous utilisons les mocks, mais ces fonctions seront remplacées
// par des appels API réels dans le futur
/*const fetchActivitiesApi = async () => {
  // Importation dynamique des mocks
  const mocks = await import("@/mocks/activitiesMocks");
  return mocks;
};*/

interface FetchActivitiesParams {
  page?: number;
  limit?: number;
  status?: ActivityStatus;
  category?: string;
  search?: string;
}

export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (params: FetchActivitiesParams, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Importer les mocks nécessaires
      const { generateMockActivities } = await import(
        "@/mocks/activitiesMocks"
      );
      const { generateMockProviders } = await import("@/mocks/providersMocks");

      // Générer des prestataires pour les activités
      const providers = generateMockProviders(10);
      // Générer les activités avec les prestataires
      const activities = generateMockActivities(20, providers);

      const response = {
        data: activities,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: activities.length,
        },
      } as PaginatedResponse<Activity>;

      dispatch(setActivitiesWithPagination(response));
      dispatch(setError(null));
      return response;
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      dispatch(setError("Erreur lors du chargement des activités"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createActivity = createAsyncThunk(
  "activities/createActivity",
  async (activity: Partial<Activity>, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newActivity = {
        ...activity,
        id: `act-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Activity;

      dispatch(setError(null));
      return newActivity;
    } catch (error) {
      console.error("Erreur lors de la création de l'activité:", error);
      dispatch(setError("Erreur lors de la création de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activities/updateActivity",
  async (activity: Activity, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedActivity = {
        ...activity,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateActivityAction(updatedActivity));
      dispatch(setError(null));
      return updatedActivity;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'activité:", error);
      dispatch(setError("Erreur lors de la mise à jour de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/deleteActivity",
  async (activityId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(deleteActivityAction(activityId));
      dispatch(setError(null));
      return activityId;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité:", error);
      dispatch(setError("Erreur lors de la suppression de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const approveActivity = createAsyncThunk(
  "activities/approveActivity",
  async (activityId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Remplacer par un appel API réel
      const activityToUpdate = {
        id: activityId,
        status: "published" as ActivityStatus,
        // Ajout des propriétés requises pour satisfaire le type Activity
        title: "",
        description: "",
        price: 0,
        category: "",
        location: "",
        providerId: "",
        createdAt: "",
        updatedAt: "",
      } as Activity;

      dispatch(updateActivityAction(activityToUpdate));
      dispatch(setError(null));
      return activityId;
    } catch (error) {
      dispatch(setError("Erreur lors de l'approbation de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const rejectActivity = createAsyncThunk(
  "activities/rejectActivity",
  async (
    { activityId, reason }: { activityId: string; reason: string },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      // TODO: Remplacer par un appel API réel
      const activityToUpdate = {
        id: activityId,
        status: "rejected" as ActivityStatus,
        rejectionReason: reason,
        // Ajout des propriétés requises pour satisfaire le type Activity
        title: "",
        description: "",
        price: 0,
        category: "",
        location: "",
        providerId: "",
        createdAt: "",
        updatedAt: "",
      } as Activity;

      dispatch(updateActivityAction(activityToUpdate));
      dispatch(setError(null));
      return { activityId, reason };
    } catch (error) {
      dispatch(setError("Erreur lors du rejet de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const removeActivity = createAsyncThunk(
  "activities/removeActivity",
  async (activityId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Remplacer par un appel API réel
      dispatch(deleteActivityAction(activityId));
      dispatch(setError(null));
      return activityId;
    } catch (error) {
      dispatch(setError("Erreur lors de la suppression de l'activité"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
