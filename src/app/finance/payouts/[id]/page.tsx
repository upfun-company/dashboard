"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { generateMockProviderPayouts } from "@/mocks/financeMocks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Page de détail d'un paiement prestataire
 */
export default function PayoutDetailPage() {
  // Utilisation de l'API asynchrone pour les paramètres de route
  const params = useParams();
  const id = params.id;

  // Dans un cas réel, nous récupérerions le paiement depuis l'API
  // Pour l'exemple, nous générons des paiements et en sélectionnons un
  const payouts = generateMockProviderPayouts(20);
  const payout = payouts.find((p) => p.id === id) || payouts[0];

  // Générer des transactions associées à ce paiement
  const associatedTransactions = Array.from({ length: 5 }, (_, i) => ({
    id: `TR${Math.floor(Math.random() * 10000)}`,
    date: new Date(
      new Date(payout.createdAt).getTime() -
        Math.random() * 7 * 24 * 60 * 60 * 1000
    ),
    amount:
      Math.round((payout.amount / 5) * (0.8 + Math.random() * 0.4) * 100) / 100,
    description: `Service ${i + 1}`,
    commission:
      Math.round(
        (payout.amount / 5) * (0.8 + Math.random() * 0.4) * 0.05 * 100
      ) / 100,
  }));

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
          <Link href="/finance/payouts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détail du paiement prestataire</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Télécharger le reçu
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Voir le relevé
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations du paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID du paiement</p>
                <p className="font-medium">{payout.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDate(new Date(payout.createdAt))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Méthode de paiement</p>
                <p className="font-medium">{payout.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <Badge className={getStatusColor(payout.status)}>
                  {payout.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant</p>
                <p className="font-medium text-lg">
                  {formatAmount(payout.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Référence</p>
                <p className="font-medium">{payout.reference}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              <p>{payout.notes || "Aucune note disponible"}</p>
            </div>
          </CardContent>
          {payout.status === "pending" && (
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button variant="default" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prestataire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{payout.providerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{payout.providerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coordonnées bancaires</p>
                <p className="font-medium">
                  IBAN: FR76 **** **** **** **** **** **
                </p>
                <p className="text-sm text-gray-500">Banque: Crédit Mutuel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions associées</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>{formatAmount(transaction.commission)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Total des transactions</p>
            <p className="font-medium">
              {formatAmount(
                associatedTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total des commissions</p>
            <p className="font-medium">
              {formatAmount(
                associatedTransactions.reduce((sum, t) => sum + t.commission, 0)
              )}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
