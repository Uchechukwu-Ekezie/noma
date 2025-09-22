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
import { OfferPopup } from "./offer-popup";
import { AcceptRejectOfferPopup } from "./accept-reject-offer-popup";
import { useOffers } from "@/hooks/use-doma";
import type { NameModel } from "@/types/doma";

interface DomainDetailPageProps {
    domain: NameModel;
}

export function DomainDetailPage({ domain }: DomainDetailPageProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showOfferPopup, setShowOfferPopup] = useState(false);
    const [showAcceptRejectPopup, setShowAcceptRejectPopup] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [offerAction, setOfferAction] = useState<"accept" | "reject" | null>(null);

    // Helper functions
    const formatAddress = (address: string): string => {
        if (!address) return "Unknown";
        const cleanAddress = address.includes(":") ? address.split(":").pop() || address : address;
        return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`;
    };

    const formatPrice = (price: string, decimals: number = 18): string => {
        try {
            const ethPrice = parseInt(price) / Math.pow(10, decimals);
            return ethPrice.toFixed(3);
        } catch {
            return "0.000";
        }
    };

    const getUSDPrice = (price: string, usdRate: number, decimals: number = 18): string => {
        try {
            const ethPrice = parseInt(price) / Math.pow(10, decimals);
            return (ethPrice * usdRate).toFixed(0);
        } catch {
            return "0";
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    const handleBuyClick = () => {
        console.log("Buy domain:", domain.name);
        // Implement buy functionality here
    };

    const handleOfferClick = () => {
        setShowOfferPopup(true);
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

    // Get the primary token and listing
    const primaryToken = domain.tokens && domain.tokens.length > 0 ? domain.tokens[0] : null;
    const primaryListing = primaryToken?.listings?.[0];
    const isListed = !!primaryListing;

    // Fetch offers for this domain
    const { data: offersData } = useOffers({
        tokenId: primaryToken?.tokenId,
        take: 10,
    });

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

                 {isListed && (
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
                         <h1 className="text-5xl font-bold text-white mb-6">{domain.name}</h1>

                         {/* Creation Date */}
                         <div className="mb-4">
                             <div className="text-xl text-white/80">
                                 Created on {new Date(primaryToken?.createdAt || domain.tokenizedAt).toLocaleDateString('en-US', {
                                     year: 'numeric',
                                     month: 'long',
                                     day: 'numeric'
                                 })}
                             </div>
                         </div>

                         {/* Current Price */}
                         {primaryListing && (
                             <div className="mb-6">
                                 <div className="text-3xl font-bold text-[#A259FF]">
                                     {formatPrice(primaryListing.price, primaryListing.currency.decimals)} {primaryListing.currency.symbol}
                                 </div>
                                 {primaryListing.currency.symbol !== 'USD' && primaryListing.currency.symbol !== 'USDC' && (
                                     <div className="text-lg text-white/80">
                                         ~${formatPrice(primaryListing.price, primaryListing.currency.decimals) * (primaryListing.currency.usdExchangeRate || 1)} USD
                                     </div>
                                 )}
                             </div>
                         )}

                         {/* Owned by Address */}
                         <div className="mb-8">
                             <div className="text-lg text-white/60 mb-2">Owned by</div>
                             <div className="text-sm text-white font-mono max-w-fit">
                                 {formatAddress(primaryToken?.ownerAddress || domain.claimedBy || "")}
                             </div>
                         </div>
                     </div>

                     {/* Right Side - Countdown Timer */}
                     {primaryListing && (
                         <div className="bg-[#3b3b3b] rounded-[20px] p-8 border border-[#A259FF]/20 min-w-[400px]">
                             <div className="text-center">
                                 <h3 className="text-2xl font-bold text-white mb-4">Listing Expires In</h3>
                                 <CountdownTimer endDate={new Date(primaryListing.expiresAt)} />
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
                     )}
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
                                 {domain.activities && domain.activities.length > 0 ? (
                                     domain.activities
                                         .filter(activity => activity && activity.type) // Filter out empty objects
                                         .map((activity, index) => (
                                             <div key={index} className="flex items-center gap-4 p-4">
                                                 <div className="w-3 h-3 bg-[#A259FF] rounded-full"></div>
                                                 <div className="flex-1">
                                                     <div className="text-white font-medium">{activity.type}</div>
                                                     <div className="text-white/60 text-sm">
                                                         {activity.sld && activity.tld && `${activity.sld}.${activity.tld} • `}
                                                         {new Date(activity.createdAt).toLocaleDateString()}
                                                     </div>
                                                 </div>
                                                 {activity.txHash && (
                                                     <div className="text-[#A259FF] font-semibold">
                                                         <a
                                                             href={`https://explorer-testnet.doma.xyz/tx/${activity.txHash}`}
                                                             target="_blank"
                                                             rel="noopener noreferrer"
                                                             className="hover:underline"
                                                         >
                                                             View TX
                                                         </a>
                                                     </div>
                                                 )}
                                             </div>
                                         ))
                                 ) : (
                                     <div className="text-center py-8">
                                         <p className="text-white/60">No history available for this domain.</p>
                                     </div>
                                 )}
                             </div>
                         </div>

                        {/* Token Information */}
                        {primaryToken && (
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                                    <Tag className="w-6 h-6 text-[#A259FF]" />
                                    Token Information
                                </h3>
                                <div className="bg-[#3b3b3b] rounded-[20px] p-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Token ID</span>
                                        <span className="text-white font-mono text-sm">
                                            {primaryToken.tokenId.slice(0, 10)}...{primaryToken.tokenId.slice(-8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Token Address</span>
                                        <span className="text-white font-mono text-sm">
                                            {formatAddress(primaryToken.tokenAddress)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Network</span>
                                        <span className="text-white">{primaryToken.chain.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Explorer</span>
                                        <a
                                            href={primaryToken.explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#A259FF] hover:underline"
                                        >
                                            View on Explorer
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Domain Stats */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Domain Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">TLD</span>
                                    <Badge className="bg-[#A259FF]/20 text-[#A259FF]">.{domain.name.split('.').pop()}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Status</span>
                                    <Badge className={isListed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                        {isListed ? 'Listed' : 'Not Listed'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Registrar</span>
                                    <span className="text-white text-sm">{domain.registrar.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Expires</span>
                                    <span className="text-white text-sm">{new Date(domain.expiresAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80">Transfer Lock</span>
                                    <Badge className={domain.transferLock ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}>
                                        {domain.transferLock ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                                {domain.isFractionalized !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/80">Fractionalized</span>
                                        <Badge className={domain.isFractionalized ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}>
                                            {domain.isFractionalized ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {isListed && (
                                    <Button
                                        className="w-full bg-[#A259FF] hover:bg-[#A259FF]/90 text-white rounded-[15px]"
                                        onClick={handleBuyClick}
                                    >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Buy Domain
                                    </Button>
                                )}
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
                                {primaryToken?.explorerUrl && (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-[15px]"
                                        onClick={() => window.open(primaryToken.explorerUrl, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View on Explorer
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Offers Section */}
                        {offersData && offersData.pages[0]?.items.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Active Offers</h3>
                                <div className="space-y-3">
                                    {offersData.pages[0].items.slice(0, 5).map((offer, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#3b3b3b] rounded-[15px] p-4 border border-[#A259FF]/20"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#A259FF]/20 rounded-full flex items-center justify-center">
                                                        <DollarSign className="w-4 h-4 text-[#A259FF]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">
                                                            {(Number(offer.price) / Math.pow(10, offer.currency.decimals)).toFixed(3)} {offer.currency.symbol}
                                                        </div>
                                                        <div className="text-white/60 text-sm">
                                                            {formatAddress(offer.offererAddress)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedOffer(offer);
                                                            setOfferAction("accept");
                                                            setShowAcceptRejectPopup(true);
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedOffer(offer);
                                                            setOfferAction("reject");
                                                            setShowAcceptRejectPopup(true);
                                                        }}
                                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs px-3 py-1"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-white/60 text-xs">
                                                Expires: {offer.expiresAt ? new Date(offer.expiresAt).toLocaleDateString() : 'No expiration'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Offer Popups */}
            <OfferPopup
                isOpen={showOfferPopup}
                onClose={() => setShowOfferPopup(false)}
                domain={domain}
            />

            <AcceptRejectOfferPopup
                isOpen={showAcceptRejectPopup}
                onClose={() => {
                    setShowAcceptRejectPopup(false);
                    setSelectedOffer(null);
                    setOfferAction(null);
                }}
                offer={selectedOffer}
                action={offerAction}
                domainName={domain.name}
            />
        </div>
    );
}