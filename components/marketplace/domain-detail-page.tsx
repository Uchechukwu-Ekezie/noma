"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    Globe,
    User,
    Star,
    Tag,
    DollarSign,
    MessageCircle,
    ExternalLink,
    TrendingUp,
    Calendar,
    Eye,
    Heart,
    Share2,
    Copy,
    CheckCircle,
    Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CountdownTimer } from "./countdown-timer";

interface DomainDetailPageProps {
    domain: any;
}

export function DomainDetailPage({ domain }: DomainDetailPageProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleBackClick = () => {
        router.back();
    };

    const handleBuyClick = () => {
        console.log("Buy domain:", domain.name);
        // Implement buy functionality here
    };

    const handleOfferClick = () => {
        console.log("Make offer for:", domain.name);
        // Implement offer functionality here
    };

    const handleContactOwner = () => {
        console.log("Contact owner for:", domain.name);
        // Implement contact functionality here
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
        console.log(`${isFollowing ? 'Unfollow' : 'Follow'} domain:`, domain.name);
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: `${domain.name} - Domain for Sale`,
                text: `Check out this premium domain: ${domain.name}`,
                url: window.location.href,
            });
        } else {
            handleCopyLink();
        }
    };

     return (
         <div className="min-h-screen bg-[#2b2b2b] text-white">
             {/* Domain Image - Full Width, 560px Height */}
             <div className="w-full h-[560px] relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF] to-[#00D4FF] flex items-center justify-center">
                     <div className="text-center">
                         <div className="text-[12rem] font-bold text-white mb-8 drop-shadow-lg">
                             {domain.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="text-4xl text-white/90 font-medium drop-shadow-lg">
                             {domain.name}
                         </div>
                     </div>
                 </div>
                 
                 {/* Back Button - Positioned on the image */}
                 <div className="absolute top-6 left-6">
                     <Button
                         onClick={handleBackClick}
                         variant="outline"
                         className="border-2 border-white/30 text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-[20px] hover:bg-white hover:text-[#A259FF] transition-colors"
                     >
                         <ArrowLeft className="w-4 h-4 mr-2" />
                         Back
                     </Button>
                 </div>
                 
                 {domain.isListed && (
                     <div className="absolute top-6 right-6">
                         <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                             <Star className="w-5 h-5 mr-2 fill-current" />
                             Listed
                         </Badge>
                     </div>
                 )}
             </div>

             {/* Domain Info Section */}
             <div className="container mx-auto px-4 py-8">
                 <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full">

                     {/* Left Side - Domain Info */}
                     <div className="flex-1 text-center lg:text-left">
                         {/* Domain Name */}
                         <h1 className="text-5xl font-bold text-white mb-6">{domain.name || domain.data?.name?.name}</h1>

                         {/* Creation Date */}
                         <div className="mb-4">
                             <div className="text-xl text-white/80">
                                 Created on {new Date(domain.data?.name?.tokens?.[0]?.createdAt || domain.data?.name?.activities?.[0]?.createdAt || '2023-01-01').toLocaleDateString('en-US', {
                                     year: 'numeric',
                                     month: 'long',
                                     day: 'numeric'
                                 })}
                             </div>
                         </div>

                         {/* Current Price */}
                         {domain.data?.name?.tokens?.[0]?.listings?.[0] && (
                             <div className="mb-6">
                                 <div className="text-3xl font-bold text-[#A259FF]">
                                     {(parseInt(domain.data.name.tokens[0].listings[0].price) / Math.pow(10, 18)).toFixed(3)} ETH
                                 </div>
                                 <div className="text-lg text-white/80">
                                     ~${((parseInt(domain.data.name.tokens[0].listings[0].price) / Math.pow(10, 18)) * domain.data.name.tokens[0].listings[0].currency.usdExchangeRate).toFixed(0)} USD
                                 </div>
                             </div>
                         )}

                         {/* Created by Address */}
                         <div className="mb-8">
                             <div className="text-lg text-white/60 mb-2">Created by</div>
                             <div className="text-sm text-white font-mono max-w-fit">
                                 {(() => {
                                     const address = domain.data?.name?.tokens?.[0]?.ownerAddress?.split(':').pop() || domain.owner || 'Unknown';
                                     return address.length > 20 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
                                 })()}
                             </div>
                         </div>
                     </div>

                     {/* Right Side - Countdown Timer */}
                     <div className="bg-[#3b3b3b] rounded-[20px] p-8 border border-[#A259FF]/20 min-w-[400px]">
                         <div className="text-center">
                             <h3 className="text-2xl font-bold text-white mb-4">Auction Ends In</h3>
                             <CountdownTimer endDate={new Date(domain.data?.name?.tokens?.[0]?.listings?.[0]?.expiresAt || Date.now() + 2 * 24 * 60 * 60 * 1000)} />
                         </div>
                         <div className="text-center mt-6">
                             <Button
                                 className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white py-6 px-12 rounded-[20px] text-2xl font-bold"
                                 onClick={handleOfferClick}
                             >
                                 <DollarSign className="w-8 h-8 mr-3" />
                                 Place Bid
                             </Button>
                         </div>
                     </div>
                 </div>
             </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Main Content */}
                     <div className="lg:col-span-2 space-y-8">
                         {/* Domain History */}
                         <div>
                             <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                                 <Clock className="w-6 h-6 text-[#A259FF]" />
                                 Domain History
                             </h3>
                             <div className="space-y-4">
                                 {domain.history.map((event: any, index: number) => (
                                     <div key={index} className="flex items-center gap-4 p-4">
                                         <div className="w-3 h-3 bg-[#A259FF] rounded-full"></div>
                                         <div className="flex-1">
                                             <div className="text-white font-medium">{event.event}</div>
                                             <div className="text-white/60 text-sm">{event.date}</div>
                                         </div>
                                         <div className="text-[#A259FF] font-semibold">{event.price}</div>
                                     </div>
                                 ))}
                             </div>
                         </div>

                        {/* Similar Domains */}
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                                <Globe className="w-6 h-6 text-[#A259FF]" />
                                Similar Domains
                            </h3>
                            <div className="grid gap-4">
                                {domain.similarDomains.map((similar: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-4">
                                        <div>
                                            <div className="text-white font-medium">{similar.name}</div>
                                            <div className="text-white/60 text-sm">{similar.owner}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[#A259FF] font-semibold">{similar.price}</div>
                                            <Button size="sm" variant="outline" className="mt-2 text-xs">
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Domain Stats */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Domain Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Category</span>
                                    <Badge className="bg-[#A259FF]/20 text-[#A259FF]">{domain.category}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Status</span>
                                    <Badge className={domain.isListed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                        {domain.isListed ? 'Listed' : 'Not Listed'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Views</span>
                                    <span className="text-white">1,234</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Followers</span>
                                    <span className="text-white">56</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button
                                    className="w-full bg-[#A259FF] hover:bg-[#A259FF]/90 text-white rounded-[15px]"
                                    onClick={handleBuyClick}
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Buy Domain
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white rounded-[15px]"
                                    onClick={handleOfferClick}
                                >
                                    Make Offer
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-white/30 text-white hover:bg-white/10 rounded-[15px]"
                                    onClick={handleContactOwner}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contact Owner
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-[15px]"
                                    onClick={() => window.open(`https://etherscan.io/address/${domain.owner}`, '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View on Explorer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
