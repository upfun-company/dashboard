"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Page de redirection vers les rapports mensuels
 */
export default function AnalyticsReportsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page des rapports mensuels
    router.push("/analytics/rapports/mensuel");
  }, [router]);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Rapports analytiques
        </h1>
        <p className="text-muted-foreground">
          Redirection vers les rapports mensuels...
        </p>
      </div>

      {/* Afficher un squelette de chargement pendant la redirection */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-3 space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="md:col-span-9">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  );
}
