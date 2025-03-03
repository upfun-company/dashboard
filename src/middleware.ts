/**
 * Middleware pour protéger les routes du dashboard
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware pour vérifier l'authentification
 */
export function middleware(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const token = request.cookies.get("auth_token")?.value;

  // URL actuelle et chemin
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Vérifier si l'utilisateur accède à la page de connexion
  const isLoginPage = path === "/login";

  // Journalisation pour le débogage
  console.log(
    `Middleware - Path: ${path}, Token: ${
      token ? "présent" : "absent"
    }, isLoginPage: ${isLoginPage}`
  );

  // Si l'utilisateur n'est pas authentifié et n'est pas sur la page de connexion, rediriger vers la page de connexion
  if (!token && !isLoginPage && path !== "/_next" && !path.includes("/api/")) {
    console.log("Redirection vers /login - Utilisateur non authentifié");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié et accède à la page de connexion, rediriger vers la page d'accueil
  if (token && isLoginPage) {
    console.log("Redirection vers / - Utilisateur déjà authentifié");
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Continuer la requête normalement
  console.log("Requête autorisée à continuer");
  return NextResponse.next();
}

/**
 * Configuration du middleware
 */
export const config = {
  // Appliquer le middleware à toutes les routes sauf les ressources statiques
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
