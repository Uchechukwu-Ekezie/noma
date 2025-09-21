"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Star, 
  Users, 
  Eye, 
  Heart, 
  Globe, 
  TrendingUp, 
  User, 
  ArrowLeft,
  Search,
  MessageCircle,
  ExternalLink,
  Tag,
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CollectionDetailPageProps {
  collection: any;
}

export function CollectionDetailPage({ collection }: CollectionDetailPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter domains based on search
  const filteredDomains = collection.domains.filter((domain: any) =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDomainClick = (domain: any) => {
    router.push(`/domains/${domain.id}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleFollowClick = () => {
    console.log("Follow collection:", collection.name);
    // Implement follow functionality here
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-white">
      {/* Header */}
      <div className="bg-[#3b3b3b] border-b border-[#A259FF]/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={handleBackClick}
              variant="outline"
              className="border-2 border-[#A259FF] text-[#A259FF] px-4 py-2 rounded-[20px] hover:bg-[#A259FF] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Collection Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Collection Image */}
            <div className="w-full lg:w-1/3">
              <div className="w-full h-80 relative rounded-[20px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl font-bold text-white mb-6 drop-shadow-lg">
                      {collection.name.split(' ')[0].charAt(0)}
                    </div>
                    <div className="text-2xl text-white/90 font-medium drop-shadow-lg">
                      Collection
                    </div>
                  </div>
                </div>
                {collection.isVerified && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Collection Info */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">{collection.name}</h1>
                <p className="text-xl text-white/80 leading-relaxed">{collection.description}</p>
              </div>

              {/* Collection Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2b2b2b] p-6 rounded-[20px] text-center border border-[#A259FF]/20">
                  <div className="text-3xl font-bold text-[#A259FF] mb-2">
                    {collection.totalDomains}
                  </div>
                  <div className="text-sm text-white/60">Total Domains</div>
                </div>
                <div className="bg-[#2b2b2b] p-6 rounded-[20px] text-center border border-[#A259FF]/20">
                  <div className="text-3xl font-bold text-[#A259FF] mb-2">
                    {collection.floorPrice}
                  </div>
                  <div className="text-sm text-white/60">Floor Price</div>
                </div>
                <div className="bg-[#2b2b2b] p-6 rounded-[20px] text-center border border-[#A259FF]/20">
                  <div className="text-3xl font-bold text-[#A259FF] mb-2">
                    {collection.volume}
                  </div>
                  <div className="text-sm text-white/60">Total Volume</div>
                </div>
                <div className="bg-[#2b2b2b] p-6 rounded-[20px] text-center border border-[#A259FF]/20">
                  <div className="text-3xl font-bold text-[#A259FF] mb-2">
                    {collection.followers}
                  </div>
                  <div className="text-sm text-white/60">Followers</div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-[#2b2b2b] p-6 rounded-[20px] border border-[#A259FF]/20">
                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-[#A259FF]" />
                  <div>
                    <div className="text-sm text-white/60">Collection Owner</div>
                    <div className="text-white font-mono text-lg">
                      {collection.owner.slice(0, 6)}...{collection.owner.slice(-4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-4 rounded-[20px] text-lg font-semibold"
                  onClick={() => document.getElementById('domains-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Browse All Domains
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white py-4 rounded-[20px] text-lg font-semibold"
                  onClick={handleFollowClick}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Follow Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domains Section */}
      <div id="domains-section" className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Globe className="w-8 h-8 text-[#A259FF]" />
                Domains in Collection
              </h2>
              <p className="text-white/80">
                Browse through all domains in the {collection.name}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#3b3b3b] border border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] focus:ring-[#A259FF] pl-10 pr-4 py-3 rounded-[20px]"
              />
            </div>
          </div>

          {/* Domains Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDomains.map((domain: any) => (
              <Card
                key={domain.id}
                className="bg-[#3b3b3b] border-[#A259FF]/20 text-white cursor-pointer group hover:shadow-lg transition-all duration-300 hover:border-[#A259FF]/40"
                onClick={() => handleDomainClick(domain)}
              >
                {/* Domain Image */}
                <div className="w-full h-48 relative rounded-t-[20px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {domain.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-lg text-white/90 font-medium drop-shadow-lg">
                        {domain.name}
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-green-500/90 text-white">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Listed
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-[#A259FF]">
                        {domain.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#A259FF]" />
                        {domain.price}
                      </div>
                      <div className="text-sm text-white/80 ml-7">
                        ~${domain.usdPrice} USD
                      </div>
                    </div>
                    <Badge variant="outline" className="text-white border-white/30">
                      <Tag className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{domain.owner}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-2 px-4 rounded-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Buy domain:", domain.name);
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
                        console.log("Contact owner for:", domain.name);
                      }}
                      title="Contact Owner"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredDomains.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white">
                <h4 className="mb-2 text-xl font-semibold">No domains found</h4>
                <p className="text-white/60">
                  Try searching with different keywords.
                </p>
                <Button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white rounded-[20px]"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
