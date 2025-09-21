"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionsBrowser } from "./collections-browser";

// Mock data for demonstration
const mockDomains = [
  {
    id: "1",
    name: "techstartup.com",
    price: "2.5",
    currency: "ETH",
    usdPrice: "6250",
    image: "/uche.svg",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    isListed: true,
  },
  {
    id: "2",
    name: "cryptoai.com",
    price: "1.8",
    currency: "ETH",
    usdPrice: "4500",
    image: "/uche.svg",
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    isListed: true,
  },
  {
    id: "3",
    name: "web3dev.com",
    price: "3.2",
    currency: "ETH",
    usdPrice: "8000",
    image: "/uche.svg",
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    isListed: true,
  },
  {
    id: "4",
    name: "blockchainapp.com",
    price: "4.1",
    currency: "ETH",
    usdPrice: "10250",
    image: "/uche.svg",
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    isListed: true,
  },
  {
    id: "5",
    name: "nftmarket.com",
    price: "2.9",
    currency: "ETH",
    usdPrice: "7250",
    image: "/uche.svg",
    owner: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    isListed: true,
  },
  {
    id: "6",
    name: "defiprotocol.com",
    price: "5.5",
    currency: "ETH",
    usdPrice: "13750",
    image: "/uche.svg",
    owner: "0x2468ace13579bdf02468ace13579bdf02468ace",
    isListed: true,
  },
];

export function DomainBrowser() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("domains");
  const DOMAINS_PER_PAGE = 6;

  // Filter domains based on search
  const filteredDomains = mockDomains.filter((domain) =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate the domains
  const startIndex = (currentPage - 1) * DOMAINS_PER_PAGE;
  const endIndex = startIndex + DOMAINS_PER_PAGE;
  const paginatedDomains = filteredDomains.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDomains.length / DOMAINS_PER_PAGE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handleTrendingSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDomainClick = (domain: any) => {
    router.push(`/domains/${domain.id}`);
  };

  const handleOfferClick = (domain: any) => {
    console.log("Make offer for:", domain);
    // You can implement offer popup here
  };

  const handleContactOwner = (domain: any) => {
    console.log("Contact owner for:", domain);
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
                  ? `Found ${filteredDomains.length} domains matching your search`
                  : "Search through thousands of premium domains or browse all available listings"}
              </p>
              {filteredDomains.length > 0 && (
                <p className="mt-2 text-sm text-white/60">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDomains.length)} of{" "}
                  {filteredDomains.length} domains
                  {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
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
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
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
          </div>

          {/* Domain Grid */}
          {paginatedDomains.length > 0 ? (
            <div className="w-full">
              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full mx-auto grid-cols-2 bg-[#2b2b2b] p-2 rounded-none max-w-7xl mb-6">
                  <TabsTrigger 
                    value="domains" 
                    className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] text-white/60 rounded-none py-4 px-6"
                  >
                    <Globe className="h-4 w-4" />
                    Domains
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collections" 
                    className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] text-white/60 rounded-none py-4 px-6"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Collections
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="domains" className="space-y-6">
                  <div className="bg-[#3b3b3b] w-full p-4 pt-6">
                    <div className="container mx-auto max-w-7xl">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedDomains.map((domain) => (
                          <div
                            key={domain.id}
                            className="transition-shadow bg-[#2b2b2b] text-white cursor-pointer group hover:shadow-lg rounded-[20px]"
                            onClick={() => handleDomainClick(domain)}
                          >
                            {/* Domain Image */}
                            <div className="w-full h-64 relative rounded-t-[20px] overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                    {domain.name.split('.')[0].charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-lg text-white/90 font-medium drop-shadow-lg">
                                    {domain.name}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="py-4">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-[#A259FF]">
                                      {domain.name}
                                    </CardTitle>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 text-white border-white bg-[#A259FF] hover:bg-[#A259FF]/80"
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
                                      {domain.price} {domain.currency}
                                    </div>
                                    <div className="text-sm text-white/80">
                                      ~${domain.usdPrice} USD
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="text-white border-white/30"
                                  >
                                    Verified
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-white/80">
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Active Listing</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-white fill-current" />
                                    <span>Featured</span>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOfferClick(domain);
                                    }}
                                  >
                                    Buy/Offer
                                  </button>
                                  <button
                                    className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDomainClick(domain);
                                    }}
                                    title="View Details"
                                  >
                                    <Search className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactOwner(domain);
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
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="container mx-auto">
                        <div className="flex items-center justify-center gap-2 mt-8">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-[#A259FF] hover:bg-[#A259FF]/90 disabled:bg-white/20 disabled:cursor-not-allowed text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </button>

                          <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={
                                    currentPage === pageNum
                                      ? "bg-white text-[#A259FF] py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                                      : "text-white border-white/20 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                                  }
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="bg-[#A259FF] hover:bg-[#A259FF]/90 disabled:bg-white/20 disabled:cursor-not-allowed text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
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
          ) : (
            <div className="py-12 text-center">
              <div className="text-white">
                <h4 className="mb-2 text-xl font-semibold">
                  {isSearching ? "No domains found" : "No domains available"}
                </h4>
                <p className="text-white/60">
                  {isSearching
                    ? "Try searching with different keywords or browse all domains."
                    : "Check back later for new domain listings."}
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
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
