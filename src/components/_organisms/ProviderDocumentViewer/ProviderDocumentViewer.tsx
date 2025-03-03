"use client";

/**
 * Composant ProviderDocumentViewer - Permet de visualiser et valider les documents soumis par un prestataire
 */

import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircle,
  XCircle,
  FileText,
  File,
  Download,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Interface pour un document de prestataire
 */
export interface ProviderDocument {
  /** Identifiant du document */
  id: string;
  /** Nom du document */
  name: string;
  /** Type du document */
  type: "identity" | "certification" | "insurance" | "other";
  /** Format du fichier */
  fileType: "pdf" | "image" | "doc" | "other";
  /** URL du document */
  url: string;
  /** Date de téléchargement */
  uploadDate: string;
  /** Statut de validation */
  status: "pending" | "approved" | "rejected";
  /** Commentaire sur le document */
  comment?: string;
}

/**
 * Interface pour les propriétés du composant ProviderDocumentViewer
 */
interface ProviderDocumentViewerProps {
  /** Identifiant du prestataire */
  providerId: string;
  /** Nom du prestataire */
  providerName: string;
  /** Liste des documents */
  documents: ProviderDocument[];
  /** Fonction appelée pour revenir à la liste */
  onBack?: () => void;
  /** Fonction appelée pour approuver un document */
  onApproveDocument?: (documentId: string) => void;
  /** Fonction appelée pour rejeter un document */
  onRejectDocument?: (documentId: string, reason?: string) => void;
  /** Fonction appelée pour approuver tous les documents */
  onApproveAll?: () => void;
  /** Fonction appelée pour télécharger un document */
  onDownload?: (documentId: string) => void;
}

/**
 * Composant ProviderDocumentViewer - Affiche et permet de gérer les documents d'un prestataire
 */
const ProviderDocumentViewer: React.FC<ProviderDocumentViewerProps> = ({
  providerName,
  documents,
  onBack,
  onApproveDocument,
  onRejectDocument,
  onApproveAll,
  onDownload,
}) => {
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    documents.length > 0 ? documents[0].id : null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const currentDocument = documents.find((doc) => doc.id === currentDocumentId);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", {
        locale: fr,
      });
    } catch {
      return dateString;
    }
  };

  // Obtenir l'icône correspondant au type de fichier
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "image":
        return (
          <Image
            src="/placeholder.png"
            alt="Image"
            width={48}
            height={48}
            className="h-12 w-12 text-blue-500"
          />
        );
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  // Obtenir le libellé du type de document
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "identity":
        return "Pièce d'identité";
      case "certification":
        return "Certification";
      case "insurance":
        return "Assurance";
      default:
        return "Autre";
    }
  };

  // Obtenir la variante du badge en fonction du statut
  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Traduire le statut en français
  const translateStatus = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      default:
        return "En attente";
    }
  };

  // Gérer le clic sur un document
  const handleDocumentClick = (document: ProviderDocument) => {
    setCurrentDocumentId(document.id);
  };

  // Gérer l'approbation d'un document
  const handleApprove = () => {
    if (currentDocument && onApproveDocument) {
      onApproveDocument(currentDocument.id);
    }
  };

  // Gérer le rejet d'un document
  const handleReject = () => {
    if (currentDocument && onRejectDocument) {
      setShowRejectDialog(true);
    }
  };

  // Gérer la confirmation du rejet
  const handleConfirmReject = () => {
    if (currentDocument && onRejectDocument && rejectReason.trim()) {
      onRejectDocument(currentDocument.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason("");
    }
  };

  /**
   * Composant pour afficher un message d'information
   */
  const InfoMessage: React.FC<{
    title: string;
    message: string;
    icon?: React.ReactNode;
  }> = ({ title, message, icon }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documents du prestataire</h2>
          <p className="text-muted-foreground">
            Vérifiez et validez les documents de {providerName}
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          )}
          {onApproveAll && (
            <Button onClick={onApproveAll}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Tout approuver
            </Button>
          )}
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <InfoMessage
              title="Aucun document"
              message="Ce prestataire n'a pas encore téléchargé de documents."
              icon={<File className="h-12 w-12 text-muted-foreground" />}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Liste des documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                      currentDocumentId === doc.id && "bg-muted"
                    )}
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        doc.status === "approved"
                          ? "bg-green-500"
                          : doc.status === "rejected"
                          ? "bg-red-500"
                          : "bg-amber-500"
                      )}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getDocumentTypeLabel(doc.type)}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(doc.status)}>
                      {translateStatus(doc.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Aperçu du document</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDocument ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">
                        {currentDocument.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {getDocumentTypeLabel(currentDocument.type)}
                        </Badge>
                        <Badge variant="outline">
                          {currentDocument.fileType.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={getStatusBadgeVariant(
                            currentDocument.status
                          )}
                        >
                          {translateStatus(currentDocument.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Téléchargé le {formatDate(currentDocument.uploadDate)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {onDownload && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onDownload(currentDocument.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Télécharger</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                window.open(currentDocument.url, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ouvrir</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Separator />

                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {currentDocument.fileType === "image" ? (
                      <Image
                        src={currentDocument.url}
                        alt={currentDocument.name}
                        width={600}
                        height={400}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="flex justify-center mb-2">
                          {getFileIcon(currentDocument.fileType)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Aperçu non disponible. Cliquez sur &quot;Ouvrir&quot;
                          pour visualiser le document.
                        </p>
                      </div>
                    )}
                  </div>

                  {currentDocument.comment && (
                    <div className="bg-muted p-3 rounded-md flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Commentaire :</p>
                        <p>{currentDocument.comment}</p>
                      </div>
                    </div>
                  )}

                  {currentDocument.status === "pending" && (
                    <div className="flex justify-end gap-2 mt-4">
                      {onRejectDocument && (
                        <Button
                          variant="outline"
                          className="gap-2 text-rose-600"
                          onClick={handleReject}
                        >
                          <XCircle className="h-4 w-4" />
                          Rejeter
                        </Button>
                      )}
                      {onApproveDocument && (
                        <Button className="gap-2" onClick={handleApprove}>
                          <CheckCircle className="h-4 w-4" />
                          Approuver
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Sélectionnez un document pour l&apos;afficher
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le document</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de ce document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motif du rejet</Label>
              <Textarea
                id="reason"
                placeholder="Expliquez pourquoi ce document est rejeté..."
                value={rejectReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setRejectReason(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderDocumentViewer;
