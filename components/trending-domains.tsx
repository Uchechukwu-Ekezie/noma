"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  DollarSign,
  User,
  Loader2,
  ArrowRight,
  ExternalLink,
  Star,
  MessageCircle,
  Search,
  Clock,
} from "lucide-react";
import { useTrendingDomains } from "@/hooks/use-doma";
import { useRouter } from "next/navigation";
import type { NameModel } from "@/types/doma";
import { getDomainAvatarUrl, getDomainGradientCSS } from "@/lib/avatar-utils";

interface TrendingDomainsProps {
  /** Number of domains to display */
  limit?: number;
  /** Custom title for the section */
  title?: string;
  /** Custom className for the card */
  className?: string;
  /** Callback when a domain is clicked */
  onDomainClick?: (domainName: string) => void;
  /** Show the component even when data is loading */
  showWhileLoading?: boolean;
  /** Show the three-section layout (featured left, view all right, cards bottom) */
  showThreeSectionLayout?: boolean;
}

// Helper function to format price
const formatPrice = (price: string, currency?: string): string => {
  try {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "Price N/A";

    // Convert from wei if needed (assuming 18 decimals for ETH)
    const ethPrice = numPrice / Math.pow(10, 18);

    if (ethPrice < 0.001) {
      return `< 0.001 ${currency || 'ETH'}`;
    }

    return `${ethPrice.toFixed(3)} ${currency || 'ETH'}`;
  } catch {
    return "Price N/A";
  }
};

// Helper function to format address
const formatAddress = (address: string): string => {
  if (!address) return "Unknown";

  // Remove CAIP-10 prefix if present
  const cleanAddress = address.includes(":")
    ? address.split(":").pop() || address
    : address;

  return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`;
};

export function TrendingDomains({
  limit = 6,
  title = "Featured Domains",
  className = "",
  onDomainClick,
  showWhileLoading = true,
  showThreeSectionLayout = false,
}: TrendingDomainsProps) {
  const router = useRouter();

  // Fetch trending domains
  const {
    data: trendingDomains,
    isLoading: isLoadingTrending,
    error: trendingError,
  } = useTrendingDomains(limit);

  const handleDomainClick = (domainName: string) => {
    if (onDomainClick) {
      onDomainClick(domainName);
    } else {
      router.push(`/domains/${encodeURIComponent(domainName)}`);
    }
  };

  const handleViewAllClick = () => {
    router.push('/marketplace');
  };

  // Don't render if loading and showWhileLoading is false
  if (isLoadingTrending && !showWhileLoading) {
    return null;
  }

  // Get featured domain (first one)
  const featuredDomain = trendingDomains?.[0];
  const remainingDomains = trendingDomains?.slice(1, limit) || [];

  if (showThreeSectionLayout) {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Top Section: Featured Domain (Left) and View All (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Featured Domain and Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              <p className="text-white/70 text-lg">
                Discover the most popular and trending domain names in the marketplace.
                These carefully curated domains represent the best opportunities in the Web3 space.
              </p>
            </div>

            {isLoadingTrending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#A259FF]" />
                <span className="ml-2 text-[#A259FF]/80">Loading featured domain...</span>
              </div>
            ) : trendingError ? (
              <div className="text-center py-8">
                <p className="text-red-400">Failed to load featured domain</p>
              </div>
            ) : featuredDomain ? (
              <Card
                className="bg-[#3b3b3b] border-[#A259FF]/20 cursor-pointer hover:border-[#A259FF]/40 transition-colors"
                onClick={() => handleDomainClick(featuredDomain.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className="mb-3 bg-[#A259FF] text-white">
                        🌟 Featured Domain
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-2">{featuredDomain.name}</h3>
                      <p className="text-white/60">
                        Premium domain with high potential value and strong branding opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {featuredDomain.tokens?.[0]?.listings?.[0] && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#A259FF]" />
                        <div>
                          <p className="text-sm text-white/60">Price</p>
                          <p className="text-[#A259FF] font-bold text-lg">
                            {formatPrice(
                              featuredDomain.tokens[0].listings[0].price,
                              featuredDomain.tokens[0].listings[0].currency.symbol
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-[#A259FF]" />
                      <div>
                        <p className="text-sm text-white/60">Owner</p>
                        <p className="text-white font-medium">
                          {formatAddress(featuredDomain.claimedBy || "")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#A259FF]" />
                      <div>
                        <p className="text-sm text-white/60">Status</p>
                        <p className="text-green-400 font-medium">Available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No featured domain available</p>
              </div>
            )}
          </div>

          {/* Right: View All Button */}
          <div className="flex flex-col justify-center items-center lg:items-end space-y-4">
            <div className="text-center lg:text-right">
              <h3 className="text-xl font-semibold text-white mb-2">Explore More</h3>
              <p className="text-white/60 mb-6">
                Browse our complete marketplace with hundreds of premium domains
              </p>
            </div>

            <Button
              onClick={handleViewAllClick}
              className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-8 py-3 rounded-[20px] text-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              View All Domains
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-sm text-white/40 text-center lg:text-right">
              {trendingDomains?.length || 0}+ domains available
            </p>
          </div>
        </div>

        {/* Bottom Section: Remaining Domain Cards */}
        {remainingDomains.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">More Featured Domains</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remainingDomains.map((domain) => {
                const listing = domain.tokens?.[0]?.listings?.[0];
                const token = domain.tokens?.[0];

                return (
                  <div
                    key={domain.name}
                    className="transition-shadow bg-[#2b2b2b] text-white cursor-pointer group hover:shadow-lg rounded-[20px]"
                    onClick={() => handleDomainClick(domain.name)}
                  >
                    {/* Domain Avatar Image */}
                    <div
                      className="w-full h-64 relative rounded-t-[20px] overflow-hidden"
                      style={{ background: getDomainGradientCSS(domain.name, 'to bottom right') }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10">
                        <div className="text-center">
                          {/* DiceBear Avatar */}
                          <div className="mb-4">
                            <img
                              src={getDomainAvatarUrl(domain.name, { size: 120 })}
                              alt={`${domain.name} avatar`}
                              className="w-30 h-30 mx-auto rounded-full border-4 border-white/20 shadow-2xl"
                              style={{ width: '120px', height: '120px' }}
                            />
                          </div>
                          <div className="text-lg text-white font-bold drop-shadow-lg tracking-wider">
                            {domain.name}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#A259FF] text-white">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <div className="py-4">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-[#A259FF] truncate">
                              {domain.name}
                            </CardTitle>
                            <p className="text-sm text-white/60 mt-1">
                              Premium Domain
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="ml-2 text-white border-white bg-green-600 hover:bg-green-700"
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Listed
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {listing ? formatPrice(listing.price, listing.currency?.symbol) : "Price N/A"}
                            </div>
                            <div className="text-sm text-white/80">
                              Premium Domain
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-white border-white/30"
                          >
                            Verified
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-white/80">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Owner: {formatAddress(domain.claimedBy || "")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Status: Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Category: Featured</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDomainClick(domain.name);
                            }}
                          >
                            Buy/Offer
                          </button>
                          <button
                            className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDomainClick(domain.name);
                            }}
                            title="View Details"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button
                            className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Contact owner for:", domain.name);
                            }}
                            title="Contact Owner"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original layout for marketplace/other pages
  return (
    <Card className={`bg-[#3b3b3b] border-[#A259FF]/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-[#A259FF]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingTrending ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#A259FF]" />
            <span className="ml-2 text-[#A259FF]/80">Loading featured domains...</span>
          </div>
        ) : trendingError ? (
          <div className="text-center py-8">
            <p className="text-red-400">Failed to load featured domains</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingDomains?.slice(0, limit).map((domain) => (
              <Card
                key={domain.name}
                className="bg-[#2b2b2b] border-[#A259FF]/20 cursor-pointer hover:border-[#A259FF]/40 transition-colors"
                onClick={() => handleDomainClick(domain.name)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">{domain.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    </div>
                    {domain.tokens?.[0]?.listings?.[0] && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-[#A259FF]" />
                        <span className="text-[#A259FF] font-medium">
                          {formatPrice(
                            domain.tokens[0].listings[0].price,
                            domain.tokens[0].listings[0].currency.symbol
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#A259FF]/60">
                      <User className="h-3 w-3" />
                      <span>{formatAddress(domain.claimedBy || "")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}