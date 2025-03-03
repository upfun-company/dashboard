"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CommissionSettings from "@/components/_organisms/CommissionSettings/CommissionSettings";
import { generateMockCommissions } from "@/mocks/financeMocks";
import Link from "next/link";

// Définition du type CommissionConfig
interface CommissionConfig {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount?: number;
  maxAmount?: number;
  applicableTo: "all" | "category" | "provider";
  categoryId?: string;
  categoryName?: string;
  providerId?: string;
  providerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Page de gestion des commissions
 */
export default function CommissionsPage() {
  // Générer des données de test
  const commissions = generateMockCommissions(10);

  // État pour les commissions
  const [commissionsList, setCommissionsList] =
    useState<CommissionConfig[]>(commissions);

  // Fonction pour ajouter une commission
  const handleAddCommission = (
    commission: Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">
  ) => {
    const newCommission: CommissionConfig = {
      ...commission,
      id: `comm-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCommissionsList([...commissionsList, newCommission]);
  };

  // Fonction pour mettre à jour une commission
  const handleUpdateCommission = (
    id: string,
    updates: Partial<CommissionConfig>
  ) => {
    setCommissionsList(
      commissionsList.map((comm) =>
        comm.id === id
          ? {
              ...comm,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : comm
      )
    );
  };

  // Fonction pour supprimer une commission
  const handleDeleteCommission = (id: string) => {
    setCommissionsList(commissionsList.filter((comm) => comm.id !== id));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gestion des commissions</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Configurez les taux de commission applicables aux différentes
          catégories de services et de prestataires. Ces paramètres déterminent
          les frais prélevés sur chaque transaction.
        </p>

        <CommissionSettings
          commissions={commissionsList}
          onAddCommission={handleAddCommission}
          onUpdateCommission={handleUpdateCommission}
          onDeleteCommission={handleDeleteCommission}
          isLoading={false}
        />
      </div>
    </div>
  );
}
