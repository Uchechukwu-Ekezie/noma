"use client";

import { DomainDetailPage } from "@/components/marketplace/domain-detail-page";
import { notFound } from "next/navigation";
import { useName } from "@/hooks/use-doma";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface DomainPageProps {
  params: {
    name: string;
  };
}

export default function DomainPage({ params }: DomainPageProps) {
  const router = useRouter();
  // Decode the domain name from URL
  const domainName = decodeURIComponent(params.name);

  // Fetch domain data from API
  const { data: domain, isLoading, error } = useName(domainName);

  // Debug logging
  useEffect(() => {
    console.log("Domain name from params:", domainName);
    console.log("Domain data:", domain);
    console.log("Loading state:", isLoading);
    console.log("Error:", error);
  }, [domainName, domain, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2b2b2b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#A259FF]" />
          <span className="text-xl text-[#A259FF]/80">Loading domain details...</span>
          <span className="text-sm text-white/60">Fetching data for: {domainName}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2b2b2b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <h1 className="text-2xl font-bold text-white">Failed to Load Domain</h1>
          <p className="text-[#A259FF]/80">
            Could not fetch details for: <span className="font-mono">{domainName}</span>
          </p>
          <p className="text-sm text-white/60">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#A259FF] text-white hover:bg-[#A259FF]/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-[#2b2b2b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Domain Not Found</h1>
          <p className="text-[#A259FF]/80">
            No domain found with name: <span className="font-mono">{domainName}</span>
          </p>
          <p className="text-sm text-white/60">
            This domain may not be tokenized or listed on the marketplace.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/marketplace")}
              className="bg-[#A259FF] text-white hover:bg-[#A259FF]/90"
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <DomainDetailPage domain={domain} />;
}

// Disable static generation to prevent serialization issues with interactive components
export const dynamic = 'force-dynamic'
