"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  FolderOpen,
  Loader2,
  DollarSign,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionsBrowser } from "./collections-browser";
import { useListings, useSearchDomains, useTrendingDomains } from "@/hooks/use-doma";
import type { NameModel, NameListingModel } from "@/types/doma";

// Categories for filtering
const categories = [
  { id: "all", name: "All Domains", count: 0 },
  { id: "tech", name: "Tech & AI", count: 0 },
  { id: "crypto", name: "Crypto & Web3", count: 0 },
  { id: "business", name: "Business", count: 0 },
  { id: "gaming", name: "Gaming", count: 0 },
  { id: "nft", name: "NFT & Art", count: 0 },
];

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

interface DomainBrowserProps {
  searchQuery?: string;
}

export function DomainBrowser({ searchQuery: initialSearchQuery }: DomainBrowserProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("domains");
  const [isSearching, setIsSearching] = useState(!!initialSearchQuery);

  // Fetch listings from Doma API
  const {
    data: listingsData,
    fetchNextPage: fetchNextListings,
    hasNextPage: hasNextListings,
    isFetchingNextPage: isFetchingNextListings,
    isLoading: isLoadingListings,
    error: listingsError,
  } = useListings({ take: 12 });

  // Fetch search results if there's a search query
  const {
    data: searchData,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
    isFetchingNextPage: isFetchingNextSearch,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchDomains(searchQuery, { take: 12 });

  // Fetch trending domains for featured section
  const {
    data: trendingDomains,
    isLoading: isLoadingTrending,
    error: trendingError,
  } = useTrendingDomains(6);

  // Determine which data to show
  const currentData = isSearching ? searchData : listingsData;
  const isLoading = isSearching ? isLoadingSearch : isLoadingListings;
  const error = isSearching ? searchError : listingsError;
  const hasNextPage = isSearching ? hasNextSearch : hasNextListings;
  const fetchNextPage = isSearching ? fetchNextSearch : fetchNextListings;
  const isFetchingNextPage = isSearching ? isFetchingNextSearch : isFetchingNextListings;

  // Flatten paginated data
  const domains = currentData?.pages?.flatMap((page) => page.items) || [];

  const handleDomainClick = (domainName: string) => {
    console.log("Clicking domain:", domainName);
    router.push(`/domains/${encodeURIComponent(domainName)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleTrendingSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  const handleOfferClick = (listing: NameListingModel) => {
    console.log("Make offer for:", listing);
    // You can implement offer popup here
  };

  const handleContactOwner = (listing: NameListingModel) => {
    console.log("Contact owner for:", listing);
    // You can implement contact functionality here
  };

  const trendingSearches = [
    "tech",
    "crypto",
    "ai",
    "web3",
    "nft",
  ];

  return (
    <div className="relative py-20 overflow-hidden bg-[#2b2b2b] lg:py-32 w-full">
      <div className="relative z-20 w-full">
        <div className="w-full">
          {/* Header */}
          <div className="container p-4 mx-auto">
            <div className="mb-8 text-left text-white">
              <h2 className="mb-4 text-[51px] font-bold">
                {isSearching && searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Find Your Perfect Domain"}
              </h2>
              <p className="text-[24px]">
                {isSearching && searchQuery
                  ? `Found ${domains.length} domains matching your search`
                  : "Search through real blockchain domains or browse all available listings"}
              </p>
              {domains.length > 0 && (
                <p className="mt-2 text-sm text-white/60">
                  Showing {domains.length} domains from Doma Testnet
                </p>
              )}
            </div>

            {/* Search Bar */}
            <div className="p-6 mb-8">
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search domains (e.g., tech, crypto, ai...)"
                    className="h-12 pl-10 text-lg rounded-[20px] border-[#A259FF]/30 border-2 bg-[#2b2b2b] text-white placeholder:text-white/60 focus:border-[#A259FF] focus:ring-[#A259FF]"
                  />
                </div>
                <button
                  type="button"
                  className="sm:w-auto border-[#A259FF]/30 border-2 text-white py-2 px-4 rounded-[20px] hover:bg-[#A259FF]/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  onClick={handleClearSearch}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {isSearching ? "Clear Search" : "Browse All"}
                </button>
                <button
                  type="submit"
                  className="sm:w-auto bg-[#A259FF] text-white py-2 px-4 rounded-[20px] hover:bg-[#A259FF]/90 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </form>
            </div>

            {/* Trending searches */}
            {!isSearching && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending:</span>
                </div>
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    className="text-sm cursor-pointer bg-[#3b3b3b] text-white hover:bg-[#A259FF]/80 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                    onClick={() => handleTrendingSearch(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Trending Domains Section */}
            {!isSearching && (
              <Card className="bg-[#3b3b3b] border-[#A259FF]/20 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-[#A259FF]" />
                    Featured Domains
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
                      {trendingDomains?.slice(0, 6).map((domain) => (
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
            )}
          </div>

          {/* Domain Grid */}
          <div className="w-full">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full mx-auto grid-cols-2 bg-[#2b2b2b] p-2 rounded-none max-w-7xl mb-6">
                <TabsTrigger
                  value="domains"
                  className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] text-white/60 rounded-none py-4 px-6"
                >
                  <Globe className="h-4 w-4" />
                  Domains ({domains.length})
                </TabsTrigger>
                <TabsTrigger
                  value="collections"
                  className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] text-white/60 rounded-none py-4 px-6"
                >
                  <User className="h-4 w-4" />
                  My Portfolio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="domains" className="space-y-6">
                <div className="bg-[#3b3b3b] w-full p-4 pt-6">
                  <div className="container mx-auto max-w-7xl">
                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#A259FF]" />
                        <span className="ml-3 text-[#A259FF]/80">
                          {searchQuery ? "Searching domains..." : "Loading domains..."}
                        </span>
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <div className="text-center py-12">
                        <p className="text-red-400 mb-4">Failed to load domains</p>
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}

                    {/* No Results */}
                    {!isLoading && !error && domains.length === 0 && (
                      <div className="text-center py-12">
                        <Globe className="h-12 w-12 mx-auto text-[#A259FF]/40 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {searchQuery ? "No domains found" : "No domains available"}
                        </h3>
                        <p className="text-[#A259FF]/60 mb-4">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : "Check back later for new listings"}
                        </p>
                        {isSearching && (
                          <button
                            onClick={handleClearSearch}
                            className="mt-4 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300"
                          >
                            Browse All Domains
                          </button>
                        )}
                      </div>
                    )}

                    {/* Domains Grid */}
                    {!isLoading && !error && domains.length > 0 && (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {domains.map((listing) => (
                          <div
                            key={listing.id}
                            className="transition-shadow bg-[#2b2b2b] text-white cursor-pointer group hover:shadow-lg rounded-[20px]"
                            onClick={() => handleDomainClick(listing.name)}
                          >
                            {/* Domain Image */}
                            <div className="w-full h-64 relative rounded-t-[20px] overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                    {listing.name.split('.')[0].charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-lg text-white/90 font-medium drop-shadow-lg">
                                    {listing.name}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-[#A259FF] text-white">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {listing.orderbook}
                                </Badge>
                              </div>
                            </div>

                            <div className="py-4">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-[#A259FF] truncate">
                                      {listing.name}
                                    </CardTitle>
                                    <p className="text-sm text-white/60 mt-1">
                                      {listing.registrar.name}
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
                                      {formatPrice(listing.price, listing.currency.symbol)}
                                    </div>
                                    <div className="text-sm text-white/80">
                                      on {listing.chain.name}
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
                                    <span>Owner: {formatAddress(listing.offererAddress)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Expires: {new Date(listing.nameExpiresAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Listed: {new Date(listing.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOfferClick(listing);
                                    }}
                                  >
                                    Buy/Offer
                                  </button>
                                  <button
                                    className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDomainClick(listing.name);
                                    }}
                                    title="View Details"
                                  >
                                    <Search className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactOwner(listing);
                                    }}
                                    title="Contact Owner"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              </CardContent>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Load More Button */}
                    {!isLoading && !error && hasNextPage && (
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="bg-[#A259FF] text-white hover:bg-[#A259FF]/90 px-8 py-4 rounded-[20px] font-semibold"
                        >
                          {isFetchingNextPage ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading more...
                            </>
                          ) : (
                            "Load More Domains"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collections" className="space-y-6">
                <div className="bg-[#3b3b3b] w-full p-4 pt-6">
                  <div className="container mx-auto max-w-7xl">
                    <CollectionsBrowser />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}