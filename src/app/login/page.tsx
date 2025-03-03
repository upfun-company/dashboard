/**
 * Page de connexion au dashboard
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/reducers/authReducer";
import { setCookie, hasCookie } from "@/utils/cookies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * Page de connexion au dashboard
 */
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Effet pour vérifier si l'utilisateur est déjà authentifié
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      // Définir le cookie pour le middleware
      setCookie("auth_token", authState.token);

      // Redirection vers la page d'accueil
      console.log("Utilisateur authentifié, redirection vers /");
      router.push("/");
    }
  }, [authState.isAuthenticated, authState.token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);

    // Validation basique
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      dispatch(loginStart());

      // Simulation d'une requête d'authentification
      // À remplacer par un appel API réel
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Vérification des identifiants (à remplacer par la logique réelle)
      if (email === "admin@upfun.fr" && password === "admin123") {
        const user = {
          id: "1",
          name: "Admin Upfun",
          email: "admin@upfun.fr",
          role: "admin" as const,
          permissions: ["all"],
        };

        // Définir le cookie pour le middleware
        const token = "fake-jwt-token-" + Date.now();
        setCookie("auth_token", token);

        const cookieSet = hasCookie("auth_token");
        setDebugInfo(
          `Authentification réussie, token défini: ${token}, Cookie présent: ${cookieSet}`
        );
        console.log(
          "Authentification réussie, token défini:",
          token,
          "Cookie présent:",
          cookieSet
        );

        dispatch(loginSuccess({ user, token }));

        // Forcer la redirection
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        dispatch(loginFailure("Identifiants incorrects"));
        setError("Identifiants incorrects");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
      console.error("Erreur d'authentification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center pb-6">
              <h1 className="text-2xl font-bold">Upfun Admin</h1>
            </div>
            <CardTitle className="text-center text-xl">Connexion</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <Alert className="mb-4">
                <AlertDescription>{debugInfo}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Identifiants de démonstration :</p>
              <p>Email : admin@upfun.fr | Mot de passe : admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
