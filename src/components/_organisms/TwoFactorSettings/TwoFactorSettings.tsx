"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Smartphone,
  Mail,
  Copy,
  CheckCircle,
  AlertTriangle,
  Key,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminUser } from "@/types/security";

export interface TwoFactorSettingsProps {
  /** Utilisateur administrateur */
  user: AdminUser;
  /** Callback appelé lorsque l'utilisateur active/désactive l'authentification à deux facteurs */
  onToggle2FA?: (enabled: boolean) => Promise<boolean>;
  /** Callback appelé lorsque l'utilisateur change la méthode d'authentification à deux facteurs */
  onChange2FAMethod?: (method: "app" | "sms" | "email") => Promise<boolean>;
  /** Callback appelé lorsque l'utilisateur vérifie un code 2FA */
  onVerifyCode?: (code: string) => Promise<boolean>;
  /** Callback appelé lorsque l'utilisateur régénère les codes de secours */
  onRegenerateBackupCodes?: () => Promise<string[]>;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant de configuration de l'authentification à deux facteurs
 */
export const TwoFactorSettings = ({
  user,
  onToggle2FA,
  onChange2FAMethod,
  onRegenerateBackupCodes,
  className,
}: TwoFactorSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"app" | "sms" | "email">(
    user.twoFactorMethod || "app"
  );
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // Codes de secours fictifs pour l'exemple
  const exampleBackupCodes = [
    "ABCD-EFGH-IJKL",
    "MNOP-QRST-UVWX",
    "1234-5678-9012",
    "3456-7890-1234",
    "5678-9012-3456",
    "7890-1234-5678",
    "9012-3456-7890",
    "2345-6789-0123",
  ];

  // Gérer l'activation/désactivation de l'authentification à deux facteurs
  const handleToggle2FA = async (enabled: boolean) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (onToggle2FA) {
        const result = await onToggle2FA(enabled);
        if (result) {
          if (enabled) {
            setIsSetupDialogOpen(true);
          } else {
            setSuccess(
              "L&apos;authentification à deux facteurs a été désactivée."
            );
          }
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le changement de méthode d'authentification à deux facteurs
  const handleChange2FAMethod = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (onChange2FAMethod) {
        const result = await onChange2FAMethod(selectedMethod);
        if (result) {
          setSuccess(
            `La méthode d&apos;authentification a été changée pour ${formatMethodName(
              selectedMethod
            )}.`
          );
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la régénération des codes de secours
  const handleRegenerateBackupCodes = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (onRegenerateBackupCodes) {
        const codes = await onRegenerateBackupCodes();
        if (codes && codes.length > 0) {
          setBackupCodes(codes);
          setShowBackupCodes(true);
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Formater le nom de la méthode d'authentification
  const formatMethodName = (method: "app" | "sms" | "email") => {
    switch (method) {
      case "app":
        return "Application d'authentification";
      case "sms":
        return "SMS";
      case "email":
        return "Email";
      default:
        return method;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Authentification à deux facteurs
        </CardTitle>
        <CardDescription>
          Renforcez la sécurité de votre compte en activant
          l&apos;authentification à deux facteurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Statut</h3>
            <p className="text-sm text-muted-foreground">
              {user.twoFactorEnabled
                ? "L'authentification à deux facteurs est activée"
                : "L'authentification à deux facteurs est désactivée"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="2fa-toggle"
              checked={user.twoFactorEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  setIsSetupDialogOpen(true);
                } else {
                  setIsDisableDialogOpen(true);
                }
              }}
            />
            <Label htmlFor="2fa-toggle">
              {user.twoFactorEnabled ? "Activée" : "Désactivée"}
            </Label>
          </div>
        </div>

        {user.twoFactorEnabled && (
          <>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Méthode d&apos;authentification
              </h3>

              <RadioGroup
                value={user.twoFactorMethod || "app"}
                onValueChange={(value: string) =>
                  setSelectedMethod(value as "app" | "sms" | "email")
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="flex items-start space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="app" id="method-app" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="method-app"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Smartphone className="h-4 w-4" />
                      Application
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Utilisez une application d&apos;authentification comme
                      Google Authenticator
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="sms" id="method-sms" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="method-sms"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Smartphone className="h-4 w-4" />
                      SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez un code par SMS sur votre téléphone
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="email" id="method-email" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="method-email"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez un code par email
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {selectedMethod !== user.twoFactorMethod && (
                <Button onClick={handleChange2FAMethod} disabled={isLoading}>
                  {isLoading ? "Chargement..." : "Changer de méthode"}
                </Button>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Codes de secours</h3>
              <p className="text-sm text-muted-foreground">
                Les codes de secours vous permettent de vous connecter si vous
                n&apos;avez pas accès à votre méthode d&apos;authentification
                principale.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Pour l'exemple, on utilise les codes fictifs
                    setBackupCodes(exampleBackupCodes);
                    setShowBackupCodes(true);
                  }}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Afficher les codes de secours
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRegenerateBackupCodes}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Régénérer les codes
                </Button>
              </div>
            </div>
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Boîte de dialogue de configuration de l'authentification à deux facteurs */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Configuration de l&apos;authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Suivez les étapes ci-dessous pour configurer
              l&apos;authentification à deux facteurs
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Méthode d&apos;authentification
              </h3>
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) =>
                  setSelectedMethod(value as "app" | "sms" | "email")
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="app" id="method-app" />
                  <Label
                    htmlFor="method-app"
                    className="flex items-center cursor-pointer"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    <div className="space-y-1">
                      <span className="font-medium">
                        Application d&apos;authentification
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Utilisez une application comme Google Authenticator ou
                        Authy
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="sms" id="method-sms" />
                  <Label
                    htmlFor="method-sms"
                    className="flex items-center cursor-pointer"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    <div className="space-y-1">
                      <span className="font-medium">SMS</span>
                      <p className="text-xs text-muted-foreground">
                        Recevez un code par SMS sur votre téléphone
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="email" id="method-email" />
                  <Label
                    htmlFor="method-email"
                    className="flex items-center cursor-pointer"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <div className="space-y-1">
                      <span className="font-medium">Email</span>
                      <p className="text-xs text-muted-foreground">
                        Recevez un code par email
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSetupDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={handleChange2FAMethod}
              className="w-full sm:w-auto"
            >
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de désactivation de l'authentification à deux facteurs */}
      <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Désactiver l&apos;authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir désactiver l&apos;authentification à deux
              facteurs ? Cela réduira la sécurité de votre compte.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Attention
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      La désactivation de l&apos;authentification à deux
                      facteurs rendra votre compte plus vulnérable aux attaques.
                      Nous vous recommandons de la garder activée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDisableDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleToggle2FA(false)}
              className="w-full sm:w-auto"
            >
              Désactiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue des codes de secours */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Codes de secours</DialogTitle>
            <DialogDescription>
              Conservez ces codes dans un endroit sûr. Ils vous permettront de
              vous connecter si vous perdez l&apos;accès à votre méthode
              d&apos;authentification principale.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <code className="text-sm font-mono">{code}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setCopiedIndex(index);
                      setTimeout(() => setCopiedIndex(-1), 2000);
                    }}
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Important
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Chaque code ne peut être utilisé qu&apos;une seule fois.
                      Conservez-les dans un gestionnaire de mots de passe ou
                      imprimez-les et gardez-les en lieu sûr.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleRegenerateBackupCodes()}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Régénérer
            </Button>
            <Button
              onClick={() => setShowBackupCodes(false)}
              className="w-full sm:w-auto"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TwoFactorSettings;
