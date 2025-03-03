/**
 * Utilitaires pour gérer les cookies
 */

/**
 * Définit un cookie
 * @param name Nom du cookie
 * @param value Valeur du cookie
 * @param days Durée de vie du cookie en jours
 */
export const setCookie = (name: string, value: string, days = 1): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
};

/**
 * Récupère la valeur d'un cookie
 * @param name Nom du cookie
 * @returns Valeur du cookie ou null si le cookie n'existe pas
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Supprime un cookie
 * @param name Nom du cookie
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Vérifie si un cookie existe
 * @param name Nom du cookie
 * @returns true si le cookie existe, false sinon
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};
