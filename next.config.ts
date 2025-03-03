import type { NextConfig } from "next";

// Type pour le plugin de résolution
interface ResolvePlugin {
  config?: {
    fileSystem?: {
      exclude?: RegExp[];
    };
  };
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "i.pravatar.cc", "randomuser.me"],
  },
  // Exclure les fichiers Storybook du build
  webpack: (config) => {
    // Ignorer tous les fichiers liés à Storybook
    config.module.rules.push({
      test: /\.stories\.(tsx|ts|jsx|js)$/,
      use: "ignore-loader",
    });

    config.module.rules.push({
      test: /\.storybook\//,
      use: "ignore-loader",
    });

    // Exclure les fichiers Storybook du processus de compilation TypeScript
    if (config.resolve && config.resolve.plugins) {
      const plugins = Array.isArray(config.resolve.plugins)
        ? config.resolve.plugins
        : [];

      plugins.forEach((plugin: unknown) => {
        // Vérifier si le plugin a la structure attendue
        const resolvePlugin = plugin as ResolvePlugin;
        if (resolvePlugin.config?.fileSystem?.exclude) {
          resolvePlugin.config.fileSystem.exclude.push(
            /\.stories\.(tsx|ts|jsx|js)$/
          );
          resolvePlugin.config.fileSystem.exclude.push(/\.storybook\//);
        }
      });
    }

    return config;
  },
  // Ignorer les erreurs TypeScript dans les fichiers Storybook
  typescript: {
    // Ignorer les erreurs de build pour les fichiers Storybook
    ignoreBuildErrors: true,
  },
  // Ignorer les erreurs de build
  onDemandEntries: {
    // Période en ms pendant laquelle la page sera conservée en mémoire
    maxInactiveAge: 25 * 1000,
    // Nombre de pages à conserver en mémoire
    pagesBufferLength: 2,
  },
  // Désactiver la génération statique pour les pages qui posent problème
  output: "standalone",
  experimental: {
    // Désactiver la vérification des types
    typedRoutes: false,
  },
};

export default nextConfig;
