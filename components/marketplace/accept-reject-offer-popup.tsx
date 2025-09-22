"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Offer {
  externalId: string;
  price: string;
  currency: {
    symbol: string;
    decimals: number;
  };
  offererAddress: string;
  orderbook: string;
  createdAt: string;
  expiresAt?: string;
}

interface AcceptRejectOfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  action: "accept" | "reject" | null;
  domainName?: string;
}

export function AcceptRejectOfferPopup({
  isOpen,
  onClose,
  offer,
  action,
  domainName,
}: AcceptRejectOfferPopupProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toFixed(3);
  };

  const trimAddress = (address: string): string => {
    if (!address) return "Unknown";
    const cleanAddress = address.includes(":") ? address.split(":").pop() || address : address;
    return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`;
  };

  const handleSendMessage = async () => {
    console.log("Send message to:", offer?.offererAddress);
    // TODO: Implement messaging functionality
  };

  const handleConfirm = async () => {
    if (!offer || !action) return;

    setIsProcessing(true);
    try {
      if (action === "accept") {
        console.log("Accepting offer:", offer.externalId);
        // TODO: Implement accept offer functionality
      } else {
        console.log("Rejecting offer:", offer.externalId);
        // TODO: Implement reject offer functionality
      }
      onClose();
    } catch (error) {
      console.error("Error processing offer:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (!offer || !action) return null;

  const isAccept = action === "accept";
  const title = isAccept ? "Accept Offer" : "Reject Offer";
  const description = isAccept
    ? "Are you sure you want to accept this offer? This action cannot be undone."
    : "Notify the offerer of the rejection.";

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md bg-[#2b2b2b] border-[#A259FF]/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            {isAccept ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6 p-1">
                {/* Warning Message */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isAccept
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {isAccept ? (
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-semibold mb-1">{title}</h4>
                      <p className="text-sm">{description}</p>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="bg-gradient-to-r from-[#A259FF]/10 to-[#00D4FF]/10 p-4 rounded-lg border border-[#A259FF]/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#A259FF]/20 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-[#A259FF]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#A259FF]">
                          {formatLargeNumber(
                            Number(offer.price) / Math.pow(10, offer.currency.decimals)
                          )}{" "}
                          <span className="text-lg">{offer.currency.symbol}</span>
                        </div>
                        <div className="text-sm text-white/60">Offer Amount</div>
                      </div>
                    </div>
                    <Badge className="bg-[#A259FF]/20 text-[#A259FF] border-[#A259FF]/30">
                      Pending
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Domain:</span>
                      <span className="font-medium text-white">{domainName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Offered by:</span>
                      <span className="font-medium text-white">
                        {trimAddress(offer.offererAddress)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Orderbook:</span>
                      <span className="font-medium text-white">{offer.orderbook}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Created:</span>
                      <span className="font-medium text-white">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {offer.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Expires:</span>
                        <span className="font-medium text-orange-400">
                          {new Date(offer.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Notice */}
                {isAccept && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div className="text-yellow-400">
                        <h5 className="font-semibold mb-1">Important Notice</h5>
                        <ul className="text-sm space-y-1">
                          <li>• This action will transfer domain ownership</li>
                          <li>• Payment will be processed automatically</li>
                          <li>• You will receive funds in your connected wallet</li>
                          <li>• This action cannot be reversed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* Sticky Action Buttons */}
          <div className="border-t border-[#A259FF]/20 bg-[#2b2b2b] pt-4">
            <div className="flex gap-2">
              {!isAccept && (
                <Button
                  onClick={handleSendMessage}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full border-[#A259FF]/30 text-[#A259FF] hover:bg-[#A259FF]/10"
                >
                  Send Message
                </Button>
              )}

              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full ${
                  isAccept
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  `${isAccept ? "Accept Offer" : "Reject Offer"}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}