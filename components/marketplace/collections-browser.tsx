"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Star,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Wallet,
  ExternalLink,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useOwnedDomains } from "@/hooks/use-doma";

// Helper function to format price from Wei to ETH
const formatPrice = (priceWei: string, decimals: number = 18) => {
  const price = parseFloat(priceWei) / Math.pow(10, decimals);
  return price.toFixed(4);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function CollectionsBrowser() {
  const router = useRouter();
  const { user, authenticated } = usePrivy();
  const userAddress = user?.wallet?.address;

  // Fetch owned domains using the Doma API
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOwnedDomains(userAddress || "", {
    take: 12, // Show 12 domains per page
  });

  const ownedDomains = data?.pages.flatMap(page => page.items) || [];
  const totalOwnedDomains = data?.pages[0]?.totalCount || 0;

  const handleDomainClick = (domain: any) => {
    router.push(`/domains/${domain.name}`);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="w-full">
      {/* Portfolio Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">My Portfolio</h2>
            <p className="text-white/60">
              {authenticated && userAddress
                ? `Domains owned by ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
                : "Connect your wallet to view your domains"
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#A259FF]">{totalOwnedDomains}</div>
            <div className="text-sm text-white/60">Total Domains</div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      {!authenticated ? (
        <div className="py-12 text-center">
          <div className="text-white">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-[#A259FF]" />
            <h4 className="mb-2 text-xl font-semibold">Connect Your Wallet</h4>
            <p className="text-white/60 mb-6">
              Connect your wallet to view your domain portfolio and manage your assets.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#2b2b2b] rounded-[20px] p-6 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-12 text-center">
          <div className="text-white">
            <h4 className="mb-2 text-xl font-semibold">Error Loading Portfolio</h4>
            <p className="text-white/60">
              There was an error loading your domains. Please try again later.
            </p>
          </div>
        </div>
      ) : ownedDomains.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ownedDomains.map((domain) => {
              const token = domain.tokens[0]; // Get the first token
              const latestListing = token?.listings?.[0];

              return (
                <div
                  key={domain.name}
                  className="transition-shadow bg-[#2b2b2b] text-white cursor-pointer group hover:shadow-lg rounded-[20px] overflow-hidden"
                  onClick={() => handleDomainClick(domain)}
                >
                  {/* Domain Header */}
                  <div className="w-full h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                          {domain.name.split('.')[0].charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs text-white/90 font-medium drop-shadow-lg">
                          {domain.name.split('.').slice(-1)[0].toUpperCase()}
                        </div>
                      </div>
                    </div>
                    {token?.type === 'OWNERSHIP' && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Owned
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <CardHeader className="pb-3 px-0">
                      <CardTitle className="text-lg font-bold text-white transition-colors group-hover:text-[#A259FF] truncate">
                        {domain.name}
                      </CardTitle>
                      <p className="text-sm text-white/60">
                        Expires: {formatDate(domain.expiresAt)}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 px-0">
                      {/* Domain Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Network</div>
                          <div className="text-white font-medium">
                            {token?.chain?.name || 'Unknown'}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Token ID</div>
                          <div className="text-white font-medium truncate">
                            {token?.tokenId ? `#${token.tokenId.slice(0, 8)}...` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Current Listing */}
                      {latestListing && (
                        <div className="bg-[#A259FF]/10 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-white/60">Current Listing</div>
                              <div className="text-lg font-bold text-[#A259FF]">
                                {formatPrice(latestListing.price, latestListing.currency.decimals)} {latestListing.currency.symbol}
                              </div>
                            </div>
                            <DollarSign className="w-5 h-5 text-[#A259FF]" />
                          </div>
                        </div>
                      )}

                      {/* Domain Stats */}
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Tokenized {formatDate(domain.tokenizedAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDomainClick(domain);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="bg-[#A259FF] hover:bg-[#A259FF]/90 disabled:bg-white/20 disabled:cursor-not-allowed text-white py-3 px-8 rounded-[20px] transition-all duration-300 cursor-pointer"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More Domains'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="text-white">
            <Globe className="w-16 h-16 mx-auto mb-4 text-[#A259FF]" />
            <h4 className="mb-2 text-xl font-semibold">No Domains Found</h4>
            <p className="text-white/60 mb-6">
              You don&apos;t own any tokenized domains yet. Explore the marketplace to find your perfect domain.
            </p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-3 px-6 rounded-[20px] transition-all duration-300 cursor-pointer"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
