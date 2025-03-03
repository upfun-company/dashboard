/**
 * Composant ProviderCard - Affiche les informations d'un prestataire en attente avec des boutons d'action
 */

import React from "react";
import { CheckCircle, XCircle, Eye, Mail, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, getInitials } from "@/utils/formatters";

/**
 * Props pour le composant ProviderCard
 */
export interface ProviderCardProps {
  /** Identifiant du prestataire */
  id: string;
  /** Nom du prestataire */
  name: string;
  /** Email du prestataire */
  email: string;
  /** Catégorie du prestataire */
  category: string;
  /** Date d'inscription */
  registrationDate: string;
  /** Statut du prestataire */
  status: "pending" | "approved" | "rejected";
  /** URL de l'avatar du prestataire */
  avatarUrl?: string;
  /** Fonction appelée lors de l'approbation d'un prestataire */
  onApprove?: (id: string) => void;
  /** Fonction appelée lors du rejet d'un prestataire */
  onReject?: (id: string) => void;
  /** Fonction appelée pour voir les détails d'un prestataire */
  onViewDetails?: (id: string) => void;
}

/**
 * Composant ProviderCard - Affiche les informations d'un prestataire en attente avec des boutons d'action
 */
const ProviderCard = ({
  id,
  name,
  email,
  category,
  registrationDate,
  status,
  avatarUrl,
  onApprove,
  onReject,
  onViewDetails,
}: ProviderCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium truncate">{name}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(registrationDate)}
              </Badge>
            </div>
          </div>

          <div className="flex gap-1">
            {onViewDetails && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voir détails</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {status === "pending" && onApprove && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-emerald-500"
                      onClick={() => onApprove(id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Approuver</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {status === "pending" && onReject && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-500"
                      onClick={() => onReject(id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rejeter</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
