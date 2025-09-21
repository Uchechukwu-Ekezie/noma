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
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock data for collections
const mockCollections = [
  {
    id: "1",
    name: "Tech Startups Collection",
    description: "Premium domains for technology startups and innovative companies",
    image: "/uche.svg",
    domains: [
      { name: "techstartup.com", price: "2.5 ETH", usdPrice: "6250" },
      { name: "innovate.io", price: "3.2 ETH", usdPrice: "8000" },
      { name: "startup.app", price: "1.8 ETH", usdPrice: "4500" },
    ],
    totalDomains: 25,
    floorPrice: "1.8 ETH",
    volume: "45.2 ETH",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    isVerified: true,
    followers: 1250,
    views: 15420,
  },
  {
    id: "2",
    name: "Crypto & DeFi",
    description: "Blockchain and decentralized finance domain names",
    image: "/uche.svg",
    domains: [
      { name: "cryptoai.com", price: "1.8 ETH", usdPrice: "4500" },
      { name: "defiprotocol.com", price: "5.5 ETH", usdPrice: "13750" },
      { name: "blockchainapp.com", price: "4.1 ETH", usdPrice: "10250" },
    ],
    totalDomains: 18,
    floorPrice: "1.8 ETH",
    volume: "67.8 ETH",
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    isVerified: true,
    followers: 890,
    views: 12300,
  },
  {
    id: "3",
    name: "NFT & Web3",
    description: "Non-fungible tokens and Web3 ecosystem domains",
    image: "/uche.svg",
    domains: [
      { name: "nftmarket.com", price: "2.9 ETH", usdPrice: "7250" },
      { name: "web3dev.com", price: "3.2 ETH", usdPrice: "8000" },
      { name: "metaverse.app", price: "4.5 ETH", usdPrice: "11250" },
    ],
    totalDomains: 32,
    floorPrice: "2.1 ETH",
    volume: "89.3 ETH",
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    isVerified: false,
    followers: 2100,
    views: 18750,
  },
  {
    id: "4",
    name: "E-commerce Hub",
    description: "Premium domains for online retail and e-commerce businesses",
    image: "/uche.svg",
    domains: [
      { name: "shoponline.com", price: "3.7 ETH", usdPrice: "9250" },
      { name: "retail.store", price: "2.8 ETH", usdPrice: "7000" },
      { name: "marketplace.io", price: "4.2 ETH", usdPrice: "10500" },
    ],
    totalDomains: 15,
    floorPrice: "2.8 ETH",
    volume: "34.6 ETH",
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    isVerified: true,
    followers: 650,
    views: 8900,
  },
  {
    id: "5",
    name: "AI & Machine Learning",
    description: "Artificial intelligence and machine learning domain names",
    image: "/uche.svg",
    domains: [
      { name: "aiplatform.com", price: "5.2 ETH", usdPrice: "13000" },
      { name: "machinelearn.io", price: "3.9 ETH", usdPrice: "9750" },
      { name: "deeplearning.app", price: "4.8 ETH", usdPrice: "12000" },
    ],
    totalDomains: 22,
    floorPrice: "3.5 ETH",
    volume: "78.4 ETH",
    owner: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    isVerified: true,
    followers: 1800,
    views: 22100,
  },
  {
    id: "6",
    name: "Finance & Banking",
    description: "Financial services and banking domain names",
    image: "/uche.svg",
    domains: [
      { name: "fintech.app", price: "6.1 ETH", usdPrice: "15250" },
      { name: "banking.io", price: "7.5 ETH", usdPrice: "18750" },
      { name: "invest.pro", price: "4.3 ETH", usdPrice: "10750" },
    ],
    totalDomains: 12,
    floorPrice: "4.3 ETH",
    volume: "92.7 ETH",
    owner: "0x2468ace13579bdf02468ace13579bdf02468ace",
    isVerified: true,
    followers: 950,
    views: 15600,
  },
];

export function CollectionsBrowser() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const COLLECTIONS_PER_PAGE = 6;

  // Paginate the collections
  const startIndex = (currentPage - 1) * COLLECTIONS_PER_PAGE;
  const endIndex = startIndex + COLLECTIONS_PER_PAGE;
  const paginatedCollections = mockCollections.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mockCollections.length / COLLECTIONS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCollectionClick = (collection: any) => {
    router.push(`/collections/${collection.id}`);
  };

  const handleFollowClick = (collection: any) => {
    console.log("Follow collection:", collection.name);
    // Implement follow functionality here
  };

  return (
    <div className="w-full">
      {/* Collections Grid */}
      {paginatedCollections.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCollections.map((collection) => (
              <div
                key={collection.id}
                className="transition-shadow bg-[#2b2b2b] text-white cursor-pointer group hover:shadow-lg rounded-[20px] overflow-hidden"
                onClick={() => handleCollectionClick(collection)}
              >
                {/* Collection Image */}
                <div className="w-full h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        {collection.name.split(' ')[0].charAt(0)}
                      </div>
                      <div className="text-sm text-white/90 font-medium drop-shadow-lg">
                        Collection
                      </div>
                    </div>
                  </div>
                  {collection.isVerified && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-[#A259FF]">
                          {collection.name}
                        </CardTitle>
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-[#A259FF]">
                          {collection.totalDomains}
                        </div>
                        <div className="text-xs text-white/60">Domains</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#A259FF]">
                          {collection.floorPrice}
                        </div>
                        <div className="text-xs text-white/60">Floor</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#A259FF]">
                          {collection.volume}
                        </div>
                        <div className="text-xs text-white/60">Volume</div>
                      </div>
                    </div>

                    {/* Sample Domains */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white/80">Featured Domains:</div>
                      <div className="space-y-1">
                        {collection.domains.slice(0, 2).map((domain, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-white/80 truncate">{domain.name}</span>
                            <span className="text-[#A259FF] font-medium">{domain.price}</span>
                          </div>
                        ))}
                        {collection.domains.length > 2 && (
                          <div className="text-xs text-white/60">
                            +{collection.domains.length - 2} more domains
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{collection.followers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{collection.views}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-white border-white/30 text-xs"
                      >
                        {collection.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollectionClick(collection);
                        }}
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        View Collection
                      </button>
                      <button
                        className="text-white bg-transparent border-white/30 hover:bg-white/10 py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center border-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowClick(collection);
                        }}
                        title="Follow Collection"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </div>
              </div>
            ))}
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
      ) : (
        <div className="py-12 text-center">
          <div className="text-white">
            <h4 className="mb-2 text-xl font-semibold">No collections found</h4>
            <p className="text-white/60">
              Check back later for new domain collections.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
