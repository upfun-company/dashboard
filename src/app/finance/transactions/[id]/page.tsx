"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { generateMockFinancialTransactions } from "@/mocks/financeMocks";
import { useParams } from "next/navigation";

/**
 * Page de détail d'une transaction financière
 */
export default function TransactionDetailPage() {
  // Dans un cas réel, nous récupérerions la transaction depuis l'API
  // Pour l'exemple, nous générons des transactions et en sélectionnons une
  const params = useParams();
  const id = params.id;
  const transactions = generateMockFinancialTransactions(20);
  const transaction = transactions.find((t) => t.id === id) || transactions[0];

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Fonction pour formater les dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/finance/transactions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détail de la transaction</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Télécharger le reçu
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Voir la facture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations de transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID de transaction</p>
                <p className="font-medium">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDate(new Date(transaction.createdAt))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant</p>
                <p className="font-medium text-lg">
                  {formatAmount(transaction.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission</p>
                <p className="font-medium">
                  {formatAmount(transaction.amount * 0.05)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p>
                {(transaction.metadata?.description as React.ReactNode) ||
                  "Aucune description disponible"}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-2">Méthode de paiement</p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                  {transaction.paymentMethod === "card"
                    ? "CB"
                    : transaction.paymentMethod}
                </div>
                <p>
                  {transaction.paymentMethod === "card"
                    ? "Carte bancaire terminant par ****4242"
                    : transaction.paymentMethod === "bank_transfer"
                    ? "Virement bancaire"
                    : "Autre méthode"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{transaction.customerName}</p>
                <p className="text-sm text-gray-500">{"email@example.com"}</p>
                <p className="text-sm text-gray-500">
                  Client depuis: {formatDate(new Date(2023, 0, 1))}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prestataire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {transaction.providerName || "Nom du prestataire"}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {transaction.providerId || "PRV12345"}
                </p>
                <p className="text-sm text-gray-500">Commission: 5%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
