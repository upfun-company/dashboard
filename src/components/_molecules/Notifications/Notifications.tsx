"use client";

/**
 * Composant Notifications - Affiche les messages d'erreur et de succès
 */

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearError } from "@/redux/reducers/errorReducer";
import { clearSuccess } from "@/redux/reducers/successReducer";
import { Toaster, toast } from "sonner";

/**
 * Composant Notifications - Affiche les messages d'erreur et de succès
 */
const Notifications = () => {
  const dispatch = useAppDispatch();

  // Récupérer les états d'erreur et de succès depuis Redux
  const { error, hasError } = useAppSelector((state) => state.error);
  const { success, hasSuccess } = useAppSelector((state) => state.success);

  // Afficher les notifications d'erreur
  useEffect(() => {
    if (hasError && error) {
      toast.error(error.message, {
        description: error.context,
        duration: 6000,
        onAutoClose: () => dispatch(clearError()),
      });
    }
  }, [hasError, error, dispatch]);

  // Afficher les notifications de succès
  useEffect(() => {
    if (hasSuccess && success) {
      toast.success(success.message, {
        description: success.context,
        duration: 6000,
        onAutoClose: () => dispatch(clearSuccess()),
      });
    }
  }, [hasSuccess, success, dispatch]);

  return <Toaster position="top-right" closeButton richColors />;
};

export default Notifications;
